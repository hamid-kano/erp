import { cn } from '@/Core/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Activity {
    text:   string;
    time:   string;
    icon?:  LucideIcon;
}

interface Props {
    activities: Activity[];
    maxItems?:  number;
    className?: string;
}

export default function ActivityFeed({ activities = [], maxItems = 5, className }: Props) {
    if (!activities.length) {
        return <div className="text-center py-6 text-xs text-slate-500">لا توجد أنشطة</div>;
    }

    return (
        <div className={cn('flex flex-col gap-3 p-4', className)}>
            {activities.slice(0, maxItems).map((activity, i) => {
                const Icon = activity.icon;
                return (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 grid place-items-center shrink-0 text-blue-400">
                            {Icon ? <Icon size={14} /> : <span className="w-2 h-2 rounded-full bg-blue-400" />}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-white leading-snug">{activity.text}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{activity.time}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
