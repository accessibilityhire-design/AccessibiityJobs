"""Small, testable operational guards for the canonical job importer."""
from contextlib import contextmanager
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
import fcntl
import hashlib
import json
import os
import tempfile


def bounded_int(name, default, minimum, maximum):
    raw = os.getenv(name, str(default))
    try:
        value = int(raw)
    except ValueError as exc:
        raise ValueError(f"{name} must be an integer") from exc
    if not minimum <= value <= maximum:
        raise ValueError(f"{name} must be between {minimum} and {maximum}")
    return value


def discovery_cutoff(watermark, today, lookback_days=7, max_age_days=30):
    """Overlap the watermark and bound initial/backfill runs; never trust future dates."""
    if watermark > today:
        raise ValueError("Database watermark is in the future; inspect dates before ingestion")
    return max(today - timedelta(days=max_age_days + 1), watermark - timedelta(days=lookback_days))


def canonical_job_url(value):
    """Discard marketing attribution, preserving requisition IDs and routing parameters."""
    if not value:
        return ''
    try:
        parts = urlsplit(str(value).strip())
        if parts.scheme.lower() not in {'http', 'https'} or not parts.hostname:
            return ''
        ignored = {'fbclid', 'gclid', 'msclkid', 'trk', 'trackingid', 'refid'}
        query = sorted((key, val) for key, val in parse_qsl(parts.query, keep_blank_values=True)
                       if not key.lower().startswith('utm_') and key.lower() not in ignored)
        host = parts.netloc.lower().removeprefix('www.')
        # Some ATS sites route job identity after '#'. Preserve those fragments.
        fragment = parts.fragment if parts.fragment.lower() not in {'top', 'apply', 'description'} else ''
        return urlunsplit(('https', host, parts.path.rstrip('/'), urlencode(query), fragment))
    except ValueError:
        return ''


class DuplicateIndex:
    def __init__(self, records, identity):
        self.identity = identity
        self.urls = set()
        self.identities = set()
        for record in records:
            self.add(record)

    def add(self, record):
        url = canonical_job_url(record.get('source_url'))
        if url:
            self.urls.add(url)
        self.identities.add(self.identity(record))
        note = record.get('additional_notes') or ''
        if 'source_evidence=' in note:
            try:
                evidence, _ = json.JSONDecoder().raw_decode(note.split('source_evidence=', 1)[1])
                if isinstance(evidence, list):
                    for item in evidence:
                        url = canonical_job_url(item.get('url')) if isinstance(item, dict) else ''
                        if url:
                            self.urls.add(url)
            except (ValueError, TypeError):
                pass

    def reason(self, record):
        url = canonical_job_url(record.get('source_url'))
        if url and url in self.urls:
            return 'canonical_source_url'
        if self.identity(record) in self.identities:
            return 'title_company'
        return ''


@contextmanager
def ingestion_lock(project_root):
    """Both canonical entry points share a lock; exiting/crashing releases it."""
    key = hashlib.sha256(str(Path(project_root).resolve()).encode()).hexdigest()[:16]
    path = Path(tempfile.gettempdir()) / f'accessibilityjobs-ingestion-{key}.lock'
    with path.open('a') as handle:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise RuntimeError('Another canonical ingestion run is active') from exc
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def insert_batch(db_url, records, columns, identity, run_id):
    """One connection and transaction, fresh deduplication, all-or-nothing writes.

    A transaction advisory lock serializes canonical writers across machines.
    No retry on an ambiguous commit: the caller must reconcile this run ID.
    """
    import psycopg2
    from psycopg2 import sql
    from psycopg2.extras import RealDictCursor

    inserted = 0
    skipped = 0
    connection = psycopg2.connect(db_url, connect_timeout=10,
                                 options='-c statement_timeout=30000 -c lock_timeout=10000')
    try:
        with connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute('SELECT pg_advisory_xact_lock(724311092)')
                cursor.execute('SELECT title, company, source_url, additional_notes FROM jobs')
                known = DuplicateIndex(cursor.fetchall(), identity)
                query = sql.SQL('INSERT INTO jobs ({}) VALUES ({}) RETURNING id').format(
                    sql.SQL(', ').join(map(sql.Identifier, columns)),
                    sql.SQL(', ').join(sql.Placeholder() for _ in columns),
                )
                for original in records:
                    if known.reason(original):
                        skipped += 1
                        continue
                    job = dict(original)
                    job['additional_notes'] = '; '.join(filter(None, [job.get('additional_notes'), f'run_id={run_id}']))
                    cursor.execute(query, [job.get(column) for column in columns])
                    if not cursor.fetchone():
                        raise RuntimeError('Insert returned no job ID')
                    inserted += 1
                    known.add(job)
        return inserted, skipped
    finally:
        connection.close()
