"""Facts returned by the optional extractor must be grounded and non-destructive."""
from unittest.mock import Mock
from app.ai_enhancer import AIEnhancer


def extractor():
    worker = AIEnhancer.__new__(AIEnhancer)
    worker.enabled = True
    worker.client = Mock()
    return worker


def test_complete_jobs_skip_model_call():
    worker = extractor()
    original = {'company': 'Example', 'employment_type': 'full-time', 'work_arrangement': 'remote',
                'key_responsibilities': 'Test interfaces', 'requirements': 'WCAG experience'}
    worker._call_openrouter = Mock()
    assert worker.enhance_job(original) == original
    worker._call_openrouter.assert_not_called()


def test_existing_source_facts_cannot_be_overwritten():
    worker = extractor()
    original = {'city': 'London', 'salary_min': 50000, 'description': 'Office: Paris. Salary USD 70000.'}
    enhanced = {'city': 'Paris', 'salary_min': 70000, '_evidence': {'city': 'Office: Paris.', 'salary_min': 'Salary USD 70000.'}}
    assert worker._merge_job_data(original, enhanced) == original


def test_unquoted_and_invented_facts_are_rejected():
    worker = extractor()
    original = {'description': 'Location: London. Work onsite.'}
    assert worker._merge_job_data(original, {'city': 'London'}) == original
    enhanced = {'country': 'USA', 'work_arrangement': 'remote', '_evidence': {'country': 'Location: USA.', 'work_arrangement': 'Work remotely.'}}
    assert worker._merge_job_data(original, enhanced) == original


def test_quote_backed_location_is_accepted():
    worker = extractor()
    original = {'description': 'Location: London.'}
    enhanced = {'city': 'London', '_evidence': {'city': 'Location: London.'}}
    assert worker._merge_job_data(original, enhanced)['city'] == 'London'


def test_salary_needs_the_actual_number_and_currency_evidence():
    worker = extractor()
    original = {'description': 'Salary: $50 per hour.'}
    enhanced = {'salary_min': 50000, 'currency': 'USD', '_evidence': {'salary_min': 'Salary: $50 per hour.', 'currency': 'Salary: $50 per hour.'}}
    assert worker._merge_job_data(original, enhanced) == original


def test_wrong_types_and_control_fields_are_rejected():
    worker = extractor()
    original = {'description': 'WCAG testing in London.'}
    enhanced = {'required_skills': [42], 'city': {'name': 'London'}, 'status': 'approved', '_evidence': {'required_skills': 'WCAG testing', 'city': 'London', 'status': 'WCAG testing'}}
    assert worker._merge_job_data(original, enhanced) == original


def test_skill_terms_must_appear_in_the_source_quote():
    worker = extractor()
    original = {'description': 'Required skills: WCAG and NVDA.'}
    enhanced = {'required_skills': ['WCAG', 'invented'], '_evidence': {'required_skills': 'Required skills: WCAG and NVDA.'}}
    assert worker._merge_job_data(original, enhanced) == original
