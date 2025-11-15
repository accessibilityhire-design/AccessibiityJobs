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
    <div className="bg-white p-6 rounded-lg border mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Label htmlFor="job-type" className="mb-2 block">
            Job Type
          </Label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger id="job-type" aria-label="Filter jobs by type">
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

