'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSubmissionSchema, JobSubmissionData } from '@/lib/validations/job';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Step1BasicInfo } from '@/components/post-job/Step1BasicInfo';
import { Step2Location } from '@/components/post-job/Step2Location';
import { Step3Compensation } from '@/components/post-job/Step3Compensation';
import { Step4Requirements } from '@/components/post-job/Step4Requirements';
import { Step5Skills } from '@/components/post-job/Step5Skills';
import { Step6Description } from '@/components/post-job/Step6Description';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

const DRAFT_KEY = 'post-job-draft';

// Which fields belong to each step, used to validate before advancing
// and to route the user back to the step containing an error.
const STEPS: Array<{ title: string; fields: (keyof JobSubmissionData)[] }> = [
  {
    title: 'Basic Information',
    fields: ['title', 'company', 'companyWebsite', 'companySize', 'industry', 'jobLevel', 'employmentType', 'department'],
  },
  {
    title: 'Location & Remote Work',
    fields: ['workArrangement', 'timezone', 'country', 'city', 'specificLocation', 'relocationAssistance'],
  },
  {
    title: 'Compensation',
    fields: ['salaryMin', 'salaryMax', 'currency', 'salaryType', 'equityOffered', 'bonusStructure'],
  },
  {
    title: 'Experience & Education',
    fields: ['yearsExperience', 'educationLevel', 'requiredCertifications', 'preferredCertifications'],
  },
  {
    title: 'Skills & Accessibility Focus',
    fields: ['requiredSkills', 'preferredSkills', 'wcagLevel', 'accessibilityFocus', 'assistiveTechExperience'],
  },
  {
    title: 'Job Description & Application Details',
    fields: [
      'description', 'keyResponsibilities', 'requirements', 'niceToHave',
      'contactEmail', 'applicationDeadline', 'expectedStartDate', 'travelRequired',
      'visaSponsorship', 'securityClearance', 'additionalNotes',
      'benefits', 'professionalDevelopment', 'healthInsurance', 'retirement', 'ptoDetails',
    ],
  },
];

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [detectedTimezone, setDetectedTimezone] = useState('');
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoredRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    trigger,
    reset,
    getValues,
  } = useForm<JobSubmissionData>({
    resolver: zodResolver(jobSubmissionSchema),
    defaultValues: {
      // Required text fields - must be strings, not undefined
      description: '',
      keyResponsibilities: '',
      requirements: '',
      contactEmail: '',
      // Optional text fields
      niceToHave: '',
      additionalNotes: '',
      // Arrays
      requiredCertifications: [],
      preferredCertifications: [],
      requiredSkills: [],
      preferredSkills: [],
      accessibilityFocus: [],
      assistiveTechExperience: [],
      benefits: [],
      // Defaults
      currency: 'USD',
      salaryType: 'annual',
      relocationAssistance: false,
      equityOffered: false,
      professionalDevelopment: false,
      healthInsurance: false,
      retirement: false,
      visaSponsorship: false,
      securityClearance: false,
    },
  });

  // Restore a saved draft, then auto-detect timezone (no third-party
  // geo-IP calls because that was a silent privacy leak).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft?.values) reset({ ...getValues(), ...draft.values });
        if (typeof draft?.step === 'number' && draft.step >= 1 && draft.step <= STEPS.length) {
          setCurrentStep(draft.step);
        }
      }
    } catch {
      // Ignore a corrupted draft
    }
    restoredRef.current = true;

    const timezone = detectTimezone();
    setDetectedTimezone(timezone);
    if (!getValues('timezone')) setValue('timezone', timezone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the draft as the user types (debounced)
  useEffect(() => {
    const subscription = watch((values) => {
      if (!restoredRef.current) return;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step: currentStep }));
      } catch {
        // Storage full or unavailable; drafts are best-effort
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, currentStep]);

  const focusStepHeading = () => {
    // After React swaps the step, move focus to the step heading so
    // keyboard and screen reader users land at the start of the new step.
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    focusStepHeading();
  };

  const handleNext = async () => {
    const valid = await trigger(STEPS[currentStep - 1].fields);
    if (valid) {
      goToStep(currentStep + 1);
    }
    // invalid: field-level role="alert" messages announce themselves
  };

  // If submit-time validation fails on a hidden step, send the user there
  const onInvalid = (formErrors: FieldErrors<JobSubmissionData>) => {
    const errorFields = Object.keys(formErrors) as (keyof JobSubmissionData)[];
    const stepWithError = STEPS.findIndex((step) =>
      step.fields.some((field) => errorFields.includes(field))
    );
    if (stepWithError !== -1) {
      setSubmitError(
        `Please fix the highlighted fields on step ${stepWithError + 1} (${STEPS[stepWithError].title}).`
      );
      goToStep(stepWithError + 1);
    }
  };

  const onSubmit = async (data: JobSubmissionData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Build legacy fields for backward compatibility
      const legacyData = {
        ...data,
        location: data.workArrangement === 'remote'
          ? 'Remote'
          : `${data.city || ''}${data.city && data.country ? ', ' : ''}${data.country || ''}`.trim() || 'Not specified',
        type: data.workArrangement,
        salaryRange: data.salaryMin && data.salaryMax
          ? `${data.currency} ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()} (${data.salaryType})`
          : '',
      };

      const response = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(legacyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit job');
      }

      localStorage.removeItem(DRAFT_KEY);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Post a Job', href: '/post-job' }]} />
        <Card className="max-w-2xl mx-auto" role="status">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">
              <h1>Accessibility job submitted successfully</h1>
            </CardTitle>
            <CardDescription>
              Thank you for submitting your accessibility job posting. Our team will
              review it to ensure it focuses on accessibility roles, and it will be
              published once approved. Reviews typically complete within 1–2 business days.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Browse jobs</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Post another job
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const totalSteps = STEPS.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Post a Job', href: '/post-job' }]} />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Post an Accessibility Job</h1>
          <p className="text-gray-600 mb-2">
            Submit your accessibility-focused job posting. All submissions are reviewed to ensure they focus on digital accessibility, WCAG compliance, inclusive design, or related roles.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Fields marked with an asterisk (*) are required. Your progress is saved
            automatically in this browser.
          </p>

          {/* Progress Indicator */}
          <div aria-hidden="true" className="flex items-center justify-between mb-4">
            {STEPS.map((_, index) => {
              const step = index + 1;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-blue-700' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Accessible step announcement + focus target on step change */}
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            aria-live="polite"
            className="text-lg font-semibold text-gray-900 focus:outline-none"
          >
            Step {currentStep} of {totalSteps}: {STEPS[currentStep - 1].title}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
          {/* Step Components - Properly Isolated */}
          {currentStep === 1 && (
            <Step1BasicInfo
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <Step2Location
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              detectedCountry=""
              detectedTimezone={detectedTimezone}
            />
          )}

          {currentStep === 3 && (
            <Step3Compensation
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <Step4Requirements
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          )}

          {currentStep === 5 && (
            <Step5Skills
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          )}

          {currentStep === 6 && (
            <Step6Description
              register={register}
              control={control}
              setValue={setValue}
              errors={errors}
            />
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-white p-4 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Job for Review'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
