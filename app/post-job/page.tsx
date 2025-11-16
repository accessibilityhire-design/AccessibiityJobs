'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSubmissionSchema, JobSubmissionData } from '@/lib/validations/job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Step1BasicInfo } from '@/components/post-job/Step1BasicInfo';
import { Step2Location } from '@/components/post-job/Step2Location';
import { Step3Compensation } from '@/components/post-job/Step3Compensation';
import { Step4Requirements } from '@/components/post-job/Step4Requirements';
import { Step5Skills } from '@/components/post-job/Step5Skills';
import { Step6Description } from '@/components/post-job/Step6Description';

// Auto-detection utilities
const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

const detectCountry = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_name || '';
  } catch {
    return '';
  }
};

const detectCurrency = (country: string) => {
  const currencyMap: Record<string, string> = {
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Spain': 'EUR',
    'Italy': 'EUR',
    'Netherlands': 'EUR',
    'India': 'INR',
    'Japan': 'JPY',
    'China': 'CNY',
    'Brazil': 'BRL',
    'Mexico': 'MXN',
  };
  return currencyMap[country] || 'USD';
};


export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [detectedCountry, setDetectedCountry] = useState('');
  const [detectedTimezone, setDetectedTimezone] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
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


  // Auto-detect timezone and country on mount
  useEffect(() => {
    const timezone = detectTimezone();
    setDetectedTimezone(timezone);
    setValue('timezone', timezone);

    detectCountry().then((country) => {
      if (country) {
        setDetectedCountry(country);
        setValue('country', country);
        const currency = detectCurrency(country);
        setValue('currency', currency);
      }
    });
  }, [setValue]);

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

      setSubmitSuccess(true);
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Accessibility Job Submitted Successfully!</CardTitle>
            <CardDescription>
              Thank you for submitting your accessibility job posting. Our team will review it to ensure it focuses on accessibility roles, and it will be published once approved.
              You will be redirected to the home page shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalSteps = 6;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Post an Accessibility Job</h1>
          <p className="text-gray-600 mb-6">
            Submit your accessibility-focused job posting. All submissions are reviewed to ensure they focus on digital accessibility, WCAG compliance, inclusive design, or related roles.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
              </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
                </div>
              </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              detectedCountry={detectedCountry}
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
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-white p-4 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1"
              >
                Next Step
              </Button>
            ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  aria-label={isSubmitting ? 'Submitting job...' : 'Submit job for review'}
                >
                {isSubmitting ? 'Submitting...' : 'Submit Job for Review'}
                </Button>
            )}
              </div>
            </form>
      </div>
    </div>
  );
}
