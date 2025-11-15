'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSubmissionSchema, JobSubmissionData } from '@/lib/validations/job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/RichTextEditor';

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

// Pre-populated options
const CERTIFICATIONS = [
  'CPACC (Certified Professional in Accessibility Core Competencies)',
  'WAS (Web Accessibility Specialist)',
  'CPWA (Certified Professional in Web Accessibility)',
  'IAAP Certification',
  'Section 508 Trusted Tester',
  'DHS Trusted Tester',
  'ACTCP (Accessible Technology Certified Professional)',
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

const JOB_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'Vice President' },
  { value: 'c-level', label: 'C-Level Executive' },
];

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: '10+ years' },
];

const EDUCATION_LEVELS = [
  { value: 'none-required', label: 'No degree required' },
  { value: 'high-school', label: 'High School / GED' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'Ph.D.' },
];

const WCAG_LEVELS = [
  { value: 'wcag-2.0', label: 'WCAG 2.0' },
  { value: 'wcag-2.1', label: 'WCAG 2.1' },
  { value: 'wcag-2.2', label: 'WCAG 2.2' },
  { value: 'wcag-3.0', label: 'WCAG 3.0 (W3C Silver)' },
];

const ACCESSIBILITY_FOCUS_AREAS = [
  'Web Accessibility',
  'Mobile Accessibility (iOS)',
  'Mobile Accessibility (Android)',
  'Desktop Applications',
  'Document Accessibility (PDF)',
  'Video & Media Accessibility',
  'Gaming Accessibility',
  'AR/VR Accessibility',
  'IoT & Smart Devices',
  'Kiosk & ATM Accessibility',
];

const ASSISTIVE_TECH = [
  'JAWS (Screen Reader)',
  'NVDA (Screen Reader)',
  'VoiceOver (macOS/iOS)',
  'TalkBack (Android)',
  'ANDI (Accessibility Testing)',
  'Axe DevTools',
  'Wave',
  'Dragon NaturallySpeaking (Voice Control)',
  'Magnification Software',
  'Switch Control',
  'Eye Tracking Technology',
];

const COMMON_SKILLS = [
  'ARIA (Accessible Rich Internet Applications)',
  'HTML5 Semantics',
  'CSS for Accessibility',
  'JavaScript Accessibility',
  'React Accessibility',
  'Angular Accessibility',
  'Vue.js Accessibility',
  'Manual Testing',
  'Automated Testing',
  'Color Contrast Analysis',
  'Keyboard Navigation',
  'Focus Management',
  'Alternative Text Writing',
  'Accessible Forms',
  'WCAG Auditing',
  'Accessibility Remediation',
  'Inclusive Design Principles',
  'User Research with PWD',
];

const BENEFITS_OPTIONS = [
  'Health Insurance (Medical, Dental, Vision)',
  '401(k) / Pension Plan',
  'Paid Time Off (PTO)',
  'Sick Leave',
  'Parental Leave',
  'Remote Work Stipend',
  'Home Office Equipment',
  'Professional Development Budget',
  'Conference Attendance',
  'Certification Reimbursement',
  'Flexible Work Hours',
  'Mental Health Support',
  'Gym Membership / Wellness Program',
  'Life Insurance',
  'Disability Insurance',
  'Stock Options / Equity',
  'Performance Bonuses',
  'Relocation Assistance',
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CNY', label: 'CNY (¥)' },
];

const SALARY_TYPES = [
  { value: 'annual', label: 'Annual' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'project', label: 'Per Project' },
];

const TRAVEL_REQUIREMENTS = [
  { value: 'none', label: 'No travel required' },
  { value: 'occasional', label: 'Occasional (1-2 times/year)' },
  { value: 'regular', label: 'Regular (Monthly)' },
  { value: 'frequent', label: 'Frequent (Weekly)' },
];

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

  const workArrangement = watch('workArrangement');
  const requiredCertifications = watch('requiredCertifications') || [];
  const preferredCertifications = watch('preferredCertifications') || [];
  const requiredSkills = watch('requiredSkills') || [];
  const preferredSkills = watch('preferredSkills') || [];
  const accessibilityFocus = watch('accessibilityFocus') || [];
  const assistiveTechExperience = watch('assistiveTechExperience') || [];
  const benefits = watch('benefits') || [];

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

  const toggleArrayItem = (array: string[], item: string, setter: (val: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
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
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
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
                      placeholder="e.g. Technology, Finance, Healthcare"
                      {...register('industry')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobLevel">Job Level</Label>
                    <Controller
                      name="jobLevel"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="jobLevel">
                            <SelectValue placeholder="Select level" />
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
                          <SelectTrigger id="employmentType">
                            <SelectValue placeholder="Select type" />
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

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g. Engineering, UX, Quality Assurance"
                      {...register('department')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location & Work Arrangement */}
          {currentStep === 2 && (
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
                        <SelectTrigger id="workArrangement">
                          <SelectValue placeholder="Select work arrangement" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="remote">Fully Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                    )}
                  />
                  {errors.workArrangement && <p className="text-sm text-red-600">{errors.workArrangement.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      Timezone {workArrangement === 'remote' && '(Auto-detected)'}
                    </Label>
                    <Input
                      id="timezone"
                      placeholder={detectedTimezone || "e.g. America/New_York"}
                      {...register('timezone')}
                    />
                    <p className="text-xs text-gray-500">
                      {detectedTimezone && `Detected: ${detectedTimezone}`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country {workArrangement !== 'remote' && '*'}
                      {detectedCountry && ' (Auto-detected)'}
                    </Label>
                    <Input
                      id="country"
                      placeholder={detectedCountry || "e.g. United States"}
                      {...register('country')}
                    />
                    <p className="text-xs text-gray-500">
                      {detectedCountry && `Detected: ${detectedCountry}`}
                    </p>
                  </div>
                </div>

                {workArrangement !== 'remote' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="e.g. San Francisco"
                          {...register('city')}
                        />
              </div>

              <div className="space-y-2">
                        <Label htmlFor="specificLocation">Specific Location / Address</Label>
                        <Input
                          id="specificLocation"
                          placeholder="e.g. Financial District, Downtown"
                          {...register('specificLocation')}
                        />
                      </div>
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Compensation & Benefits */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Compensation & Benefits</CardTitle>
                <CardDescription>Salary range and benefits package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="salaryMin">Minimum Salary</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="e.g. 80000"
                      {...register('salaryMin', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="e.g. 120000"
                      {...register('salaryMax', { valueAsNumber: true })}
                    />
              </div>

              <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((curr) => (
                              <SelectItem key={curr.value} value={curr.value}>
                                {curr.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="salaryType">Salary Type</Label>
                    <Controller
                      name="salaryType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="salaryType">
                            <SelectValue />
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
              </div>

                <div className="space-y-2">
                  <Label htmlFor="bonusStructure">Bonus Structure</Label>
                  <Input
                    id="bonusStructure"
                    placeholder="e.g. Annual performance bonus up to 15%"
                    {...register('bonusStructure')}
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
                    Stock options / Equity offered
                  </Label>
                </div>

                <div className="space-y-3">
                  <Label>Quick Benefits Selection</Label>
                  <div className="flex flex-wrap gap-2">
                    <Controller
                      name="healthInsurance"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                          <Checkbox
                            id="healthInsurance"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="healthInsurance" className="font-normal cursor-pointer">
                            Health Insurance
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name="retirement"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                          <Checkbox
                            id="retirement"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="retirement" className="font-normal cursor-pointer">
                            401(k) / Retirement
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name="professionalDevelopment"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                          <Checkbox
                            id="professionalDevelopment"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="professionalDevelopment" className="font-normal cursor-pointer">
                            Professional Development
                          </Label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Additional Benefits (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg">
                    {BENEFITS_OPTIONS.map((benefit) => (
                      <div key={benefit} className="flex items-start space-x-2">
                        <Checkbox
                          id={`benefit-${benefit}`}
                          checked={benefits.includes(benefit)}
                          onCheckedChange={() => {
                            const current = watch('benefits') || [];
                            toggleArrayItem(current, benefit, (val) => setValue('benefits', val));
                          }}
                        />
                        <Label
                          htmlFor={`benefit-${benefit}`}
                          className="font-normal cursor-pointer text-sm leading-tight"
                        >
                          {benefit}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ptoDetails">PTO Details</Label>
                  <Input
                    id="ptoDetails"
                    placeholder="e.g. 20 days per year, Unlimited PTO"
                    {...register('ptoDetails')}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Requirements & Qualifications */}
          {currentStep === 4 && (
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
          )}

          {/* Step 5: Skills & Accessibility Focus */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Skills & Accessibility Focus</CardTitle>
                <CardDescription>Specify technical skills and accessibility expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Accessibility Focus Areas *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg">
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
                        <Label htmlFor={`focus-${area}`} className="font-normal cursor-pointer text-sm">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.accessibilityFocus && <p className="text-sm text-red-600">{errors.accessibilityFocus.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Assistive Technology Experience</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg">
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
                        <Label htmlFor={`tech-${tech}`} className="font-normal cursor-pointer text-sm">
                          {tech}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Required Skills *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg">
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
                        <Label htmlFor={`req-skill-${skill}`} className="font-normal cursor-pointer text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.requiredSkills && <p className="text-sm text-red-600">{errors.requiredSkills.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Preferred Skills (Nice to have)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg">
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
                        <Label htmlFor={`pref-skill-${skill}`} className="font-normal cursor-pointer text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Job Description & Final Details */}
          {currentStep === 6 && (
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

                  <div className="flex flex-wrap gap-4">
                    <Controller
                      name="visaSponsorship"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="visaSponsorship"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="visaSponsorship" className="font-normal cursor-pointer">
                            Visa sponsorship available
                          </Label>
                        </div>
                      )}
                    />

                    <Controller
                      name="securityClearance"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="securityClearance"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="securityClearance" className="font-normal cursor-pointer">
                            Security clearance required
                          </Label>
                        </div>
                      )}
                    />
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any other important information about the role, company culture, or application process..."
                      rows={4}
                      {...register('additionalNotes')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
            )}

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
      </div>
    </div>
  );
}
