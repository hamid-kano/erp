import { cn } from '@/Core/lib/utils';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface Props {
    icon:       LucideIcon;
    label:      string;
    value:      string | number;
    iconClass?: string;
    className?: string;
}

export default function StatCard({ icon: Icon, label, value, iconClass, className }: Props) {
    return (
        <Card bodyClassName={cn('flex items-center gap-4 py-4', className)}>
            <div className={cn('w-10 h-10 rounded-xl grid place-items-center shrink-0', iconClass ?? 'bg-blue-500/10 text-blue-400')}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <div className="text-xs text-slate-400 uppercase tracking-wide truncate">{label}</div>
                <div className="text-lg font-bold text-white mt-0.5 truncate">{value}</div>
            </div>
        </Card>
    );
}
