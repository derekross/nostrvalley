import { Calendar, Clock, MapPin } from 'lucide-react';
import { NOSTR_VALLEY_2026 } from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface EventFactsProps {
  className?: string;
  /** Compact single-row layout (used in cards). */
  compact?: boolean;
}

/** Date / time / venue block for the annual event. */
export function EventFacts({ className, compact }: EventFactsProps) {
  const e = NOSTR_VALLEY_2026;
  const itemClass = cn(
    'flex items-center gap-2.5',
    compact ? 'text-sm' : 'text-base md:text-lg',
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        compact ? 'sm:flex-row sm:flex-wrap sm:gap-x-6' : 'sm:items-center',
        className,
      )}
    >
      <div className={itemClass}>
        <Calendar className="h-5 w-5 text-primary shrink-0" />
        <span className="font-semibold">{e.dateLabel}</span>
      </div>
      <div className={itemClass}>
        <Clock className="h-5 w-5 text-primary shrink-0" />
        <span>{e.timeLabel}</span>
      </div>
      <div className={itemClass}>
        <MapPin className="h-5 w-5 text-primary shrink-0" />
        <span>
          <span className="font-semibold">{e.venue}</span>
          <span className="text-muted-foreground"> &middot; {e.locationLong}</span>
        </span>
      </div>
    </div>
  );
}
