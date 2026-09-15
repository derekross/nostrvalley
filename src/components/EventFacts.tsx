import { Calendar, Clock, MapPin } from 'lucide-react';
import { NOSTR_VALLEY_2026 } from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface EventFactsProps {
  className?: string;
  /** Compact layout for cards. */
  compact?: boolean;
}

/** Date / time / venue block for the annual event. Venue is primary, city secondary. */
export function EventFacts({ className, compact }: EventFactsProps) {
  const e = NOSTR_VALLEY_2026;
  const rowClass = cn('flex items-center gap-2.5', compact ? 'text-sm' : 'text-base md:text-lg');
  const iconClass = 'h-5 w-5 text-primary shrink-0';

  return (
    <div className={cn('flex flex-col', compact ? 'gap-2' : 'gap-2.5 items-center', className)}>
      <div className={rowClass}>
        <Calendar className={iconClass} />
        <span className="font-semibold">{e.dateLabel}</span>
      </div>
      <div className={rowClass}>
        <Clock className={iconClass} />
        <span>{e.timeLabel}</span>
      </div>
      <div className={cn('flex items-start gap-2.5', compact ? 'text-sm' : 'text-base md:text-lg')}>
        <MapPin className={cn(iconClass, 'mt-0.5')} />
        <span className={cn('flex flex-col leading-snug', !compact && 'items-center sm:items-start')}>
          <span className="font-semibold">{e.venue}</span>
          <span className="text-muted-foreground">{e.locationLong}</span>
        </span>
      </div>
    </div>
  );
}
