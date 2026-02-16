'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface JobFiltersProps {
  initialType?: string;
}

export function JobFilters({ initialType = 'all' }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type') || initialType;

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-slate-800">Filter by work arrangement</p>
          <p className="text-sm text-slate-600">Switch between remote, hybrid, and onsite opportunities.</p>
        </div>

        <div className="w-full md:w-72">
          <Label htmlFor="job-type" className="mb-2 block text-slate-700 font-medium">
            Job Type
          </Label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="job-type"
              aria-label="Filter jobs by type"
              className="w-full bg-white border-slate-300 text-slate-900"
            >
              <SelectValue placeholder="All job types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All job types</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
