'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface JobFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function JobFilters({ selectedType, onTypeChange }: JobFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Label htmlFor="job-type" className="mb-2 block">
            Job Type
          </Label>
          <Select value={selectedType} onValueChange={onTypeChange}>
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

