import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    // Format salary
    const formatSalary = () => {
        if (job.salaryMin && job.salaryMax) {
            if (job.salaryMin === job.salaryMax) {
                return `$${job.salaryMin.toLocaleString()}`;
            }
            return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
        }
        if (job.salaryRange) return job.salaryRange;
        return 'Competitive Salary';
    };

    // Format skills safely
    const getSkills = () => {
        try {
            if (!job.requiredSkills) return [];
            const skills = JSON.parse(job.requiredSkills);
            return Array.isArray(skills) ? skills.slice(0, 3) : [];
        } catch {
            return [];
        }
    };

    const isNew = job.createdAt && (new Date().getTime() - new Date(job.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full overflow-hidden">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {isNew && (
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                                New
                            </span>
                        )}
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${job.workArrangement === 'remote' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {job.workArrangement === 'remote' ? 'Remote' : job.workArrangement === 'hybrid' ? 'Hybrid' : 'Onsite'}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {job.employmentType === 'full-time' ? 'Full Time' : job.employmentType}
                        </span>
                    </div>

                    <Link href={`/jobs/${job.id}`} className="block">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {job.title}
                        </h3>
                    </Link>

                    <div className="flex items-center text-gray-600 text-sm mt-1">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="font-medium mr-3">{job.company}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{job.city && job.country ? `${job.city}, ${job.country}` : job.location}</span>
                </div>
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{formatSalary()}</span>
                </div>
                <div className="flex items-center col-span-2">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Posted {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently'}</span>
                </div>
            </div>

            {/* Skills */}
            <div className="mb-6 flex flex-wrap gap-2">
                {getSkills().map((skill: string, index: number) => (
                    <span
                        key={index}
                        className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100"
                    >
                        {skill}
                    </span>
                ))}
                {(JSON.parse(job.requiredSkills || '[]').length > 3) && (
                    <span className="text-xs text-gray-400 px-2 py-1">+{(JSON.parse(job.requiredSkills || '[]').length - 3)} more</span>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <Link href={`/jobs/${job.id}`} className="w-full">
                    <Button className="group/button w-full border border-slate-300 bg-white text-slate-900 shadow-sm transition-all hover:border-blue-800 hover:bg-blue-800 hover:text-white focus-visible:ring-blue-700 focus-visible:ring-offset-2">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-0.5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
