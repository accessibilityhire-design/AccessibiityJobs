'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSubmissionSchema, JobSubmissionData } from '@/lib/validations/job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobSubmissionData>({
    resolver: zodResolver(jobSubmissionSchema),
  });

  const jobType = watch('type');

  const onSubmit = async (data: JobSubmissionData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Post an Accessibility Job</h1>
          <p className="text-gray-600 mb-3">
            Submit your accessibility-focused job posting for free. All submissions are reviewed to ensure they focus on digital accessibility, WCAG compliance, inclusive design, or related roles.
          </p>
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-blue-800">
              ✓ 100% Free Job Posting
            </span>
            <span className="text-blue-300">|</span>
            <span className="text-sm font-semibold text-blue-800">
              ✓ Quick Approval Process
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility Job Details</CardTitle>
            <CardDescription>
              Provide detailed information about your accessibility-focused job opportunity. We focus on roles related to digital accessibility, WCAG compliance, inclusive design, assistive technology, and accessibility engineering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Accessibility Engineer, WCAG Compliance Specialist, Inclusive Design Lead"
                  {...register('title')}
                  aria-invalid={errors.title ? 'true' : 'false'}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="text-sm text-red-600" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g. Acme Corp"
                  {...register('company')}
                  aria-invalid={errors.company ? 'true' : 'false'}
                  aria-describedby={errors.company ? 'company-error' : undefined}
                />
                {errors.company && (
                  <p id="company-error" className="text-sm text-red-600" role="alert">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Remote, New York, or Global"
                    {...register('location')}
                    aria-invalid={errors.location ? 'true' : 'false'}
                    aria-describedby={errors.location ? 'location-error' : undefined}
                  />
                  {errors.location && (
                    <p id="location-error" className="text-sm text-red-600" role="alert">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={jobType} onValueChange={(value) => setValue('type', value as any)}>
                    <SelectTrigger 
                      id="type"
                      aria-invalid={errors.type ? 'true' : 'false'}
                      aria-describedby={errors.type ? 'type-error' : undefined}
                    >
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p id="type-error" className="text-sm text-red-600" role="alert">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the accessibility-focused role, responsibilities (e.g., WCAG audits, accessibility testing, inclusive design), and how this position contributes to digital accessibility..."
                  rows={8}
                  {...register('description')}
                  aria-invalid={errors.description ? 'true' : 'false'}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-sm text-red-600" role="alert">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List required accessibility skills and experience (e.g., WCAG 2.1/2.2 knowledge, screen reader testing, ARIA, accessibility auditing tools, etc.)..."
                  rows={8}
                  {...register('requirements')}
                  aria-invalid={errors.requirements ? 'true' : 'false'}
                  aria-describedby={errors.requirements ? 'requirements-error' : undefined}
                />
                {errors.requirements && (
                  <p id="requirements-error" className="text-sm text-red-600" role="alert">
                    {errors.requirements.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range (Optional)</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g. $80,000 - $120,000"
                    {...register('salaryRange')}
                    aria-invalid={errors.salaryRange ? 'true' : 'false'}
                    aria-describedby={errors.salaryRange ? 'salary-error' : undefined}
                  />
                  {errors.salaryRange && (
                    <p id="salary-error" className="text-sm text-red-600" role="alert">
                      {errors.salaryRange.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    placeholder="https://example.com"
                    {...register('companyWebsite')}
                    aria-invalid={errors.companyWebsite ? 'true' : 'false'}
                    aria-describedby={errors.companyWebsite ? 'website-error' : undefined}
                  />
                  {errors.companyWebsite && (
                    <p id="website-error" className="text-sm text-red-600" role="alert">
                      {errors.companyWebsite.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="hiring@example.com"
                  {...register('contactEmail')}
                  aria-invalid={errors.contactEmail ? 'true' : 'false'}
                  aria-describedby={errors.contactEmail ? 'email-error' : undefined}
                />
                {errors.contactEmail && (
                  <p id="email-error" className="text-sm text-red-600" role="alert">
                    {errors.contactEmail.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  This email will be visible to job seekers for applications
                </p>
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  aria-label={isSubmitting ? 'Submitting job...' : 'Submit job for review'}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

