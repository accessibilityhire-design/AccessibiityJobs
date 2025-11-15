'use client';

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CERTIFICATIONS, EXPERIENCE_LEVELS, EDUCATION_LEVELS, WCAG_LEVELS, toggleArrayItem } from '@/lib/constants/job-form';

interface Step4RequirementsProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  watch: UseFormWatch<JobSubmissionData>;
  setValue: UseFormSetValue<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
}

export function Step4Requirements({ register, control, watch, setValue, errors }: Step4RequirementsProps) {
  const requiredCertifications = watch('requiredCertifications') || [];
  const preferredCertifications = watch('preferredCertifications') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Requirements & Qualifications</CardTitle>
        <CardDescription>What are you looking for in a candidate?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Controller
              name="yearsExperience"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="yearsExperience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
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
            <Label htmlFor="educationLevel">Education Level</Label>
            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="educationLevel">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Required Certifications</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert} className="flex items-start space-x-2">
                <Checkbox
                  id={`req-cert-${cert}`}
                  checked={requiredCertifications.includes(cert)}
                  onCheckedChange={() => {
                    const current = watch('requiredCertifications') || [];
                    toggleArrayItem(current, cert, (val) => setValue('requiredCertifications', val));
                  }}
                />
                <Label
                  htmlFor={`req-cert-${cert}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {cert}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Certifications (Nice to have)</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert} className="flex items-start space-x-2">
                <Checkbox
                  id={`pref-cert-${cert}`}
                  checked={preferredCertifications.includes(cert)}
                  onCheckedChange={() => {
                    const current = watch('preferredCertifications') || [];
                    toggleArrayItem(current, cert, (val) => setValue('preferredCertifications', val));
                  }}
                />
                <Label
                  htmlFor={`pref-cert-${cert}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {cert}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wcagLevel">WCAG Knowledge Level</Label>
          <Controller
            name="wcagLevel"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="wcagLevel">
                  <SelectValue placeholder="Select WCAG level" />
                </SelectTrigger>
                <SelectContent>
                  {WCAG_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

