'use client';

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TRAVEL_REQUIREMENTS } from '@/lib/constants/job-form';

interface Step6DescriptionProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  setValue: UseFormSetValue<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
}

export function Step6Description({ register, control, setValue, errors }: Step6DescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 6: Job Description & Application Details</CardTitle>
        <CardDescription>Provide detailed information about the role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Job Overview / Description *</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="Provide a comprehensive overview of the role, what the team does, and how this position contributes to digital accessibility...

Use bullet points:
• Key point 1
• Key point 2

Or numbered lists for priorities"
                minHeight="250px"
              />
            )}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          <p className="text-xs text-gray-500">Minimum 100 characters - Use the toolbar for formatting</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyResponsibilities">Key Responsibilities *</Label>
          <Controller
            name="keyResponsibilities"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="List the key responsibilities using bullet points:

• Conduct WCAG 2.2 audits on web applications
• Lead accessibility testing with screen readers (JAWS, NVDA, VoiceOver)
• Collaborate with design and engineering teams to ensure accessibility from the start
• Create and maintain accessibility documentation
• Provide training to team members on accessibility best practices"
                minHeight="250px"
              />
            )}
          />
          {errors.keyResponsibilities && <p className="text-sm text-red-600">{errors.keyResponsibilities.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Required Qualifications *</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="List the required qualifications:

• 5+ years of experience in accessibility testing and remediation
• Strong knowledge of WCAG 2.1/2.2 Level AA standards
• Hands-on experience with screen readers (JAWS, NVDA, VoiceOver)
• Proficiency in HTML, CSS, and JavaScript for accessibility
• Experience with accessibility testing tools (Axe, Wave, ANDI)
• Excellent communication skills to work with cross-functional teams"
                minHeight="250px"
              />
            )}
          />
          {errors.requirements && <p className="text-sm text-red-600">{errors.requirements.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="niceToHave">Nice to Have / Preferred Qualifications</Label>
          <Controller
            name="niceToHave"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="List preferred qualifications that would be a plus:

• CPACC or WAS certification
• Experience with accessibility automation tools and CI/CD integration
• Public speaking or conference presentations on accessibility topics
• Contributions to open-source accessibility projects
• Experience mentoring or training others on accessibility"
                minHeight="200px"
              />
            )}
          />
        </div>

        <div className="border-t pt-6 space-y-6">
          <h3 className="text-lg font-semibold">Application Details</h3>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="hiring@example.com"
              {...register('contactEmail')}
              aria-invalid={errors.contactEmail ? 'true' : 'false'}
            />
            {errors.contactEmail && <p className="text-sm text-red-600">{errors.contactEmail.message}</p>}
            <p className="text-sm text-gray-500">This email will be visible to job seekers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                {...register('applicationDeadline')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedStartDate">Expected Start Date</Label>
              <Input
                id="expectedStartDate"
                placeholder="e.g. Immediate, March 2025, Flexible"
                {...register('expectedStartDate')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelRequired">Travel Requirements</Label>
            <Controller
              name="travelRequired"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="travelRequired">
                    <SelectValue placeholder="Select travel requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_REQUIREMENTS.map((travel) => (
                      <SelectItem key={travel.value} value={travel.value}>
                        {travel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="visaSponsorship"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="visaSponsorship"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="visaSponsorship" className="font-normal cursor-pointer">
                Visa sponsorship available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="securityClearance"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="securityClearance"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="securityClearance" className="font-normal cursor-pointer">
                Security clearance required
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Controller
              name="additionalNotes"
              control={control}
              render={({ field }) => (
                <textarea
                  id="additionalNotes"
                  {...field}
                  placeholder="Any additional information about the role, company culture, or application process..."
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

