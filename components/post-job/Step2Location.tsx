'use client';

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';

interface Step2LocationProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  watch: UseFormWatch<JobSubmissionData>;
  setValue: UseFormSetValue<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
  detectedCountry: string;
  detectedTimezone: string;
}

export function Step2Location({ 
  register, 
  control, 
  watch, 
  setValue, 
  errors,
  detectedCountry,
  detectedTimezone 
}: Step2LocationProps) {
  const workArrangement = watch('workArrangement');

  // Auto-update location field when work arrangement changes
  useEffect(() => {
    if (workArrangement === 'remote') {
      setValue('location', 'Remote');
      if (detectedCountry) {
        setValue('country', detectedCountry);
      }
    }
  }, [workArrangement, detectedCountry, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Location & Work Arrangement</CardTitle>
        <CardDescription>Where will this role be based?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workArrangement">Work Arrangement *</Label>
          <Controller
            name="workArrangement"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="workArrangement" aria-invalid={errors.workArrangement ? 'true' : 'false'}>
                  <SelectValue placeholder="Select work arrangement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.workArrangement && <p className="text-sm text-red-600">{errors.workArrangement.message}</p>}
        </div>

        {workArrangement !== 'remote' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  placeholder={detectedCountry || "e.g. United States"}
                  {...register('country')}
                  defaultValue={detectedCountry}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. San Francisco"
                  {...register('city')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificLocation">Specific Location</Label>
              <Input
                id="specificLocation"
                placeholder="e.g. Floor 5, Building A, 123 Main St"
                {...register('specificLocation')}
              />
            </div>
          </>
        )}

        {workArrangement === 'remote' && (
          <div className="space-y-2">
            <Label htmlFor="country">Country (for remote roles)</Label>
            <Input
              id="country"
              placeholder={detectedCountry || "e.g. United States"}
              {...register('country')}
              defaultValue={detectedCountry}
            />
            <p className="text-xs text-gray-500">Specify the country where the remote position is based</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            placeholder={detectedTimezone || "e.g. America/New_York"}
            {...register('timezone')}
            defaultValue={detectedTimezone}
          />
          <p className="text-xs text-gray-500">Auto-detected: {detectedTimezone}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location Summary</Label>
          <Input
            id="location"
            placeholder={workArrangement === 'remote' ? 'Remote' : 'e.g. San Francisco, CA, United States'}
            {...register('location')}
            defaultValue={workArrangement === 'remote' ? 'Remote' : ''}
          />
          <p className="text-xs text-gray-500">This will be displayed on the job listing</p>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="relocationAssistance"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="relocationAssistance"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="relocationAssistance" className="font-normal cursor-pointer">
            Relocation assistance available
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

