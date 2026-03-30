import { cn } from '@/Core/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Activity {
    text:  string;
    time:  string;
    icon?: LucideIcon;
}

interface Props {
    activities: Activity[];
    maxItems?:  number;
    className?: string;
}

export default function ActivityFeed({ activities = [], maxItems = 5, className }: Props) {
    if (!activities.length) {
        return (
            <div className="text-center py-6 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                لا توجد أنشطة
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-3 p-4', className)}>
            {activities.slice(0, maxItems).map((activity, i) => {
                const Icon = activity.icon;
                return (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}>
                            {Icon ? <Icon size={14} /> : <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium leading-snug" style={{ color: 'var(--color-text-strong)' }}>
                                {activity.text}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                {activity.time}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
