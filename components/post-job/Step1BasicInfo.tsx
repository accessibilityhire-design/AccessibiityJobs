'use client';

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPANY_SIZES, JOB_LEVELS, EMPLOYMENT_TYPES } from '@/lib/constants/job-form';

interface Step1BasicInfoProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
}

export function Step1BasicInfo({ register, control, errors }: Step1BasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Basic Information</CardTitle>
        <CardDescription>Tell us about the company and position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Senior Accessibility Engineer, WCAG Compliance Specialist"
            {...register('title')}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              placeholder="e.g. Acme Corp"
              {...register('company')}
              aria-invalid={errors.company ? 'true' : 'false'}
            />
            {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              type="url"
              placeholder="https://example.com"
              {...register('companyWebsite')}
            />
            {errors.companyWebsite && <p className="text-sm text-red-600">{errors.companyWebsite.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Controller
              name="companySize"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g. Technology, Healthcare, Finance"
              {...register('industry')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobLevel">Job Level</Label>
            <Controller
              name="jobLevel"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="jobLevel">
                    <SelectValue placeholder="Select job level" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="employmentType" aria-invalid={errors.employmentType ? 'true' : 'false'}>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentType && <p className="text-sm text-red-600">{errors.employmentType.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="e.g. Engineering, Product, Design"
            {...register('department')}
          />
        </div>
      </CardContent>
    </Card>
  );
}

