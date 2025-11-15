'use client';

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobSubmissionData } from '@/lib/validations/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CURRENCIES, SALARY_TYPES, BENEFITS_OPTIONS } from '@/lib/constants/job-form';

interface Step3CompensationProps {
  register: UseFormRegister<JobSubmissionData>;
  control: Control<JobSubmissionData>;
  errors: FieldErrors<JobSubmissionData>;
}

export function Step3Compensation({ register, control, errors }: Step3CompensationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Compensation & Benefits</CardTitle>
        <CardDescription>Salary range and benefits package</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Minimum Salary</Label>
            <Input
              id="salaryMin"
              type="number"
              placeholder="e.g. 80000"
              {...register('salaryMin', { valueAsNumber: true })}
            />
            {errors.salaryMin && <p className="text-sm text-red-600">{errors.salaryMin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Maximum Salary</Label>
            <Input
              id="salaryMax"
              type="number"
              placeholder="e.g. 120000"
              {...register('salaryMax', { valueAsNumber: true })}
            />
            {errors.salaryMax && <p className="text-sm text-red-600">{errors.salaryMax.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryType">Salary Type</Label>
          <Controller
            name="salaryType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="salaryType">
                  <SelectValue placeholder="Select salary type" />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bonusStructure">Bonus Structure</Label>
          <Textarea
            id="bonusStructure"
            placeholder="e.g. Annual performance bonus up to 20% of base salary"
            {...register('bonusStructure')}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="equityOffered"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="equityOffered"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="equityOffered" className="font-normal cursor-pointer">
            Equity/Stock options offered
          </Label>
        </div>

        <div className="space-y-4">
          <Label>Benefits (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BENEFITS_OPTIONS.map((benefit) => (
              <Controller
                key={benefit}
                name="benefits"
                control={control}
                render={({ field }) => {
                  const benefits = field.value || [];
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`benefit-${benefit}`}
                        checked={benefits.includes(benefit)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...benefits, benefit]);
                          } else {
                            field.onChange(benefits.filter((b) => b !== benefit));
                          }
                        }}
                      />
                      <Label htmlFor={`benefit-${benefit}`} className="font-normal cursor-pointer text-sm">
                        {benefit}
                      </Label>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="professionalDevelopment"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="professionalDevelopment"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="professionalDevelopment" className="font-normal cursor-pointer">
              Professional Development
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="healthInsurance"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="healthInsurance"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="healthInsurance" className="font-normal cursor-pointer">
              Health Insurance
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="retirement"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="retirement"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="retirement" className="font-normal cursor-pointer">
              Retirement Plan
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ptoDetails">PTO Details</Label>
          <Input
            id="ptoDetails"
            placeholder="e.g. 20 days PTO, 10 holidays, unlimited sick leave"
            {...register('ptoDetails')}
          />
        </div>
      </CardContent>
    </Card>
  );
}

