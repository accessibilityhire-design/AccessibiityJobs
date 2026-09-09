"""Regression coverage for overlap discovery, deduplication and write safety."""
import json
import os
import tempfile
import unittest
from datetime import date, timedelta
from unittest.mock import Mock, patch
from bs4 import BeautifulSoup
from ingestion_support import DuplicateIndex, bounded_int, canonical_job_url, discovery_cutoff, ingestion_lock, insert_batch
from run_a11yjobs_daily import job_identity, exclude_post_enrichment_cutoff_rows, run_pipeline, fetch_existing_records, extract_apply_url, fetch_external_text


class DiscoveryTests(unittest.TestCase):
    def test_same_day_and_late_discovery_are_eligible(self):
        today = date.today()
        cutoff = discovery_cutoff(today, today)
        rows = [{'date_posted': today.isoformat()}, {'date_posted': (today - timedelta(days=3)).isoformat()}]
        eligible, failures = exclude_post_enrichment_cutoff_rows(rows, cutoff)
        self.assertEqual(eligible, rows)
        self.assertEqual(failures, [])

    def test_empty_database_backfill_is_bounded(self):
        self.assertEqual(discovery_cutoff(date(1970, 1, 1), date(2026, 9, 9)), date(2026, 8, 9))

    def test_future_watermark_stops_run(self):
        with self.assertRaises(ValueError):
            discovery_cutoff(date(2026, 9, 10), date(2026, 9, 9))

    def test_missing_and_future_dates_are_rejected(self):
        today = date.today()
        rows, failures = exclude_post_enrichment_cutoff_rows([{}, {'date_posted': (today + timedelta(days=1)).isoformat()}], today - timedelta(days=7))
        self.assertEqual(rows, [])
        self.assertEqual(len(failures), 2)

    @patch.dict(os.environ, {'MULTISOURCE_DETAIL_WORKERS': '100'})
    def test_unbounded_concurrency_is_rejected(self):
        with self.assertRaises(ValueError):
            bounded_int('MULTISOURCE_DETAIL_WORKERS', 4, 1, 6)


class IdentityTests(unittest.TestCase):
    def test_tracking_variants_match(self):
        self.assertEqual(canonical_job_url('http://www.example.com/jobs/123/?utm_source=li&gclid=abc'), canonical_job_url('https://example.com/jobs/123'))

    def test_requisition_ids_and_hash_routes_are_preserved(self):
        self.assertNotEqual(canonical_job_url('https://example.com/jobs?jobId=1'), canonical_job_url('https://example.com/jobs?jobId=2'))
        self.assertNotEqual(canonical_job_url('https://example.com/#/jobs/1'), canonical_job_url('https://example.com/#/jobs/2'))

    def test_dedupes_normalized_employer_and_title(self):
        known = DuplicateIndex([{'title': 'Accessibility Engineer', 'company': 'Example, Inc.'}], job_identity)
        self.assertEqual(known.reason({'title': 'ACCESSIBILITY ENGINEER', 'company': 'example inc'}), 'title_company')

    def test_preserves_original_discovery_url_from_evidence(self):
        known = DuplicateIndex([{'title': 'A', 'company': 'B', 'source_url': 'https://employer.test/1', 'additional_notes': 'source_evidence=[{"source":"a11yjobs","url":"https://a11yjobs.com/jobs/1"}]; run_id=123'}], job_identity)
        self.assertIn('https://a11yjobs.com/jobs/1', known.urls)

    def test_lock_rejects_overlapping_run_and_releases(self):
        with tempfile.TemporaryDirectory() as root:
            with ingestion_lock(root):
                with self.assertRaises(RuntimeError):
                    with ingestion_lock(root):
                        self.fail('overlapping run entered')
            with ingestion_lock(root):
                pass


class PipelineSafetyTests(unittest.TestCase):
    def test_sign_in_links_are_not_application_urls(self):
        soup = BeautifulSoup('<a href="/login">Sign in to apply</a><a href="https://careers.example.test/jobs/123">Apply</a>', 'html.parser')
        self.assertEqual(extract_apply_url(soup, 'https://board.test/jobs/123', {}), 'https://careers.example.test/jobs/123')
        self.assertIsNone(extract_apply_url(BeautifulSoup('<a href="/login">Apply</a>', 'html.parser'), 'https://board.test/jobs/123', {}))

    def test_sign_in_redirect_stops_without_proxy_retry(self):
        session = Mock()
        session.get.return_value = Mock(url='https://board.test/login', status_code=200, text='Sign in to continue')
        content, status, _ = fetch_external_text(session, 'https://board.test/jobs/123/apply')
        self.assertIsNone(content)
        self.assertEqual(status, 'requires_sign_in')
        session.get.assert_called_once()

    @patch('run_a11yjobs_daily.psql_query', return_value=(0, '[{"title":"First"},\n {"title":"Second"}]', ''))
    def test_multiline_database_snapshot_is_not_truncated(self, query):
        self.assertEqual(len(fetch_existing_records('postgresql://example.invalid/test')), 2)

    @patch('run_a11yjobs_daily.fetch_page')
    @patch('run_a11yjobs_daily.fetch_cutoff_date', side_effect=RuntimeError('database unavailable'))
    @patch('run_a11yjobs_daily.load_database_url', return_value='postgresql://example.invalid/test')
    def test_database_failure_prevents_source_requests(self, load, cutoff, fetch):
        with self.assertRaises(RuntimeError):
            run_pipeline(dry_run=True)
        fetch.assert_not_called()

    def test_dry_run_validates_and_never_calls_insert(self):
        from contextlib import ExitStack
        from run_a11yjobs_daily import REQUIRED_FIELDS
        row = {field: 'provided' for field in REQUIRED_FIELDS}
        row.update(title='Accessibility engineer', company='Example', source_url='https://employer.test/jobs/1', date_posted=date.today().isoformat())
        with tempfile.TemporaryDirectory() as directory, ExitStack() as stack:
            patches = {
                'load_database_url': 'postgresql://example.invalid/test', 'fetch_cutoff_date': date.today(),
                'fetch_existing_records': [], 'fetch_page': None, 'scrape_jobspy_jobs': ([row], {'status': 'completed'}),
                'consolidate_source_candidates': ([row], []), 'process_candidate_job': (row, row, None),
            }
            for name, value in patches.items():
                stack.enter_context(patch(f'run_a11yjobs_daily.{name}', return_value=value))
            for name, filename in [('CANDIDATES_JSON', 'candidates.json'), ('INSERT_READY_JSON', 'ready.json'), ('CANDIDATES_CSV', 'review.csv')]:
                stack.enter_context(patch(f'run_a11yjobs_daily.{name}', os.path.join(directory, filename)))
            stack.enter_context(patch('run_a11yjobs_daily.OUTPUT_DIR', directory))
            insert = stack.enter_context(patch('run_a11yjobs_daily.insert_batch'))
            self.assertEqual(run_pipeline(dry_run=True), 0)
            insert.assert_not_called()
            with open(os.path.join(directory, 'ready.json')) as handle:
                self.assertEqual(len(json.load(handle)['jobs']), 1)


@unittest.skipUnless(os.getenv('INGESTION_TEST_DATABASE_URL'), 'Optional isolated PostgreSQL integration test')
class TransactionTests(unittest.TestCase):
    def setUp(self):
        import psycopg2
        self.url = os.environ['INGESTION_TEST_DATABASE_URL']
        if 'accessibilityjobs_test' not in self.url:
            raise RuntimeError('Integration tests require the isolated accessibilityjobs_test database')
        self.conn = psycopg2.connect(self.url)
        self.conn.autocommit = True
        with self.conn.cursor() as c:
            c.execute('DROP TABLE IF EXISTS jobs')
            c.execute('CREATE TABLE jobs (id serial PRIMARY KEY, title text NOT NULL, company text NOT NULL, source_url text, additional_notes text)')

    def tearDown(self):
        self.conn.close()

    def test_repeated_batches_are_idempotent(self):
        rows = [{'title': 'Accessibility Engineer', 'company': 'Example', 'source_url': 'https://example.test/jobs/1'}]
        cols = ['title', 'company', 'source_url', 'additional_notes']
        self.assertEqual(insert_batch(self.url, rows, cols, job_identity, 'test-1'), (1, 0))
        rows[0]['source_url'] += '?utm_source=li'
        self.assertEqual(insert_batch(self.url, rows, cols, job_identity, 'test-2'), (0, 1))

    def test_failed_row_rolls_back_entire_batch(self):
        rows = [{'title': 'Good', 'company': 'Example'}, {'title': None, 'company': 'Other'}]
        with self.assertRaises(Exception):
            insert_batch(self.url, rows, ['title', 'company', 'additional_notes'], job_identity, 'rollback')
        with self.conn.cursor() as c:
            c.execute('SELECT count(*) FROM jobs')
            self.assertEqual(c.fetchone()[0], 0)


if __name__ == '__main__':
    unittest.main()
