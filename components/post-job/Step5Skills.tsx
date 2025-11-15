'use client';

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ACCESSIBILITY_FOCUS_AREAS, ASSISTIVE_TECH, COMMON_SKILLS, toggleArrayItem } from '@/lib/constants/job-form';

interface Step5SkillsProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  watch: UseFormWatch<JobSubmissionData>;
  setValue: UseFormSetValue<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
}

export function Step5Skills({ register, control, watch, setValue, errors }: Step5SkillsProps) {
  const requiredSkills = watch('requiredSkills') || [];
  const preferredSkills = watch('preferredSkills') || [];
  const accessibilityFocus = watch('accessibilityFocus') || [];
  const assistiveTechExperience = watch('assistiveTechExperience') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Skills & Accessibility Focus</CardTitle>
        <CardDescription>Specify technical skills and accessibility expertise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Required Skills *</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {COMMON_SKILLS.map((skill) => (
              <div key={skill} className="flex items-start space-x-2">
                <Checkbox
                  id={`req-skill-${skill}`}
                  checked={requiredSkills.includes(skill)}
                  onCheckedChange={() => {
                    const current = watch('requiredSkills') || [];
                    toggleArrayItem(current, skill, (val) => setValue('requiredSkills', val));
                  }}
                />
                <Label
                  htmlFor={`req-skill-${skill}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
          {errors.requiredSkills && <p className="text-sm text-red-600">{errors.requiredSkills.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Preferred Skills (Nice to have)</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {COMMON_SKILLS.map((skill) => (
              <div key={skill} className="flex items-start space-x-2">
                <Checkbox
                  id={`pref-skill-${skill}`}
                  checked={preferredSkills.includes(skill)}
                  onCheckedChange={() => {
                    const current = watch('preferredSkills') || [];
                    toggleArrayItem(current, skill, (val) => setValue('preferredSkills', val));
                  }}
                />
                <Label
                  htmlFor={`pref-skill-${skill}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Accessibility Focus Areas *</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {ACCESSIBILITY_FOCUS_AREAS.map((area) => (
              <div key={area} className="flex items-start space-x-2">
                <Checkbox
                  id={`focus-${area}`}
                  checked={accessibilityFocus.includes(area)}
                  onCheckedChange={() => {
                    const current = watch('accessibilityFocus') || [];
                    toggleArrayItem(current, area, (val) => setValue('accessibilityFocus', val));
                  }}
                />
                <Label
                  htmlFor={`focus-${area}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>
          {errors.accessibilityFocus && <p className="text-sm text-red-600">{errors.accessibilityFocus.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Assistive Technology Experience</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-4 border rounded-lg">
            {ASSISTIVE_TECH.map((tech) => (
              <div key={tech} className="flex items-start space-x-2">
                <Checkbox
                  id={`tech-${tech}`}
                  checked={assistiveTechExperience.includes(tech)}
                  onCheckedChange={() => {
                    const current = watch('assistiveTechExperience') || [];
                    toggleArrayItem(current, tech, (val) => setValue('assistiveTechExperience', val));
                  }}
                />
                <Label
                  htmlFor={`tech-${tech}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {tech}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

