import { Download, Expand, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  NOSTR_VALLEY_2026,
  SCHEDULE_2026,
  SCHEDULE_FOOTNOTE,
  SCHEDULE_IMAGE_URL,
  durationMinutes,
  formatTimeRange,
  type ScheduleItem,
} from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

function speakerLine(item: ScheduleItem): string | undefined {
  if (!item.speakers?.length) return undefined;
  const names = item.speakers.map((s) => s.name);
  // Hosts read as a pair ("Derek Ross + Seth"); panelists as a list.
  return item.kind === 'logistics' ? names.join(' + ') : names.join(', ');
}

function ScheduleRow({ item }: { item: ScheduleItem }) {
  const isPanel = item.kind === 'panel';
  const isTalk = item.kind === 'talk';
  const speakers = speakerLine(item);

  return (
    <li
      className={cn(
        'grid grid-cols-[5.75rem_1fr] sm:grid-cols-[10.5rem_2rem_1fr] gap-x-3 py-4 px-3 sm:px-4',
        isPanel && 'my-2 rounded-lg border-l-4 border-primary bg-primary/10',
      )}
    >
      <div className="text-sm sm:text-base font-semibold tabular-nums leading-snug sm:whitespace-nowrap">
        <time dateTime={`${NOSTR_VALLEY_2026.date}T${item.start}`}>
          {formatTimeRange(item.start, item.end)}
        </time>
        {isPanel && (
          <span className="block text-xs font-medium text-primary mt-0.5">
            {durationMinutes(item.start, item.end)} min
          </span>
        )}
      </div>

      <div className="hidden sm:flex justify-center pt-0.5" aria-hidden="true">
        {isTalk ? (
          <span className="text-xs font-bold text-primary tabular-nums">
            {String(item.number).padStart(2, '0')}
          </span>
        ) : (
          <span className={cn('mt-2 h-1.5 w-1.5 rounded-full', isPanel ? 'bg-amber-500' : 'bg-primary/60')} />
        )}
      </div>

      <div className="min-w-0">
        {isPanel && (
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">Panel</p>
        )}
        <p
          className={cn(
            'leading-snug break-words',
            isTalk || isPanel ? 'text-base md:text-lg font-semibold' : 'text-base font-medium',
          )}
        >
          {isTalk && <span className="sr-only">Talk {item.number}: </span>}
          {item.title}
        </p>
        {speakers && (
          <p className={cn('mt-0.5 text-sm', isPanel ? 'text-muted-foreground' : 'text-primary')}>{speakers}</p>
        )}
      </div>
    </li>
  );
}

/** The full run of show for Nostr Valley III, as text. */
export function ScheduleAgenda({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="hidden sm:grid grid-cols-[10.5rem_2rem_1fr] gap-x-3 px-4 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground border-b">
        <span>Time · Eastern</span>
        <span />
        <span>Session / Speaker</span>
      </div>
      <ol className="divide-y divide-border">
        {SCHEDULE_2026.map((item) => (
          <ScheduleRow key={item.id} item={item} />
        ))}
      </ol>
      <p className="mt-4 px-3 sm:px-4 text-sm text-muted-foreground">{SCHEDULE_FOOTNOTE}</p>
    </div>
  );
}

/** Thumbnail of the shareable lineup graphic with view and download actions. */
export function ScheduleGraphic({ className }: { className?: string }) {
  const alt = `${NOSTR_VALLEY_2026.name} lineup graphic: the full ${NOSTR_VALLEY_2026.dateLabel} schedule with session times and speakers.`;
  return (
    <Card className={cn('overflow-hidden', className)}>
      <a href={SCHEDULE_IMAGE_URL} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative max-h-[28rem] overflow-hidden bg-[#0d0f1a]">
          <img
            src={SCHEDULE_IMAGE_URL}
            alt={alt}
            width={1600}
            height={2603}
            loading="lazy"
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0f1a] to-transparent" />
        </div>
      </a>
      <CardContent className="p-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={SCHEDULE_IMAGE_URL} target="_blank" rel="noopener noreferrer">
            <Expand className="h-4 w-4 mr-2" />
            View full size
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href={SCHEDULE_IMAGE_URL} download="nostr-valley-iii-schedule.png">
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

interface ScheduleSectionProps {
  /** Render the section heading. Defaults to true. */
  showHeading?: boolean;
  className?: string;
}

/** Agenda plus graphic, laid out side by side on wide screens. */
export function ScheduleSection({ showHeading = true, className }: ScheduleSectionProps) {
  const e = NOSTR_VALLEY_2026;
  const talkCount = SCHEDULE_2026.filter((item) => item.kind === 'talk').length;
  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={cn('py-14 md:py-20 scroll-mt-16', className)}>
      <div className="container mx-auto px-4">
        {showHeading && (
          <div className="text-center mb-8 md:mb-10">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
              <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
              {e.dateLabel}
            </Badge>
            <h2 id="schedule-heading" className="text-3xl md:text-4xl font-bold tracking-tight uppercase mb-3">
              The Schedule
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {e.timeLabel} at {e.venue}. {talkCount} talks, a panel, and time to hang out.
            </p>
          </div>
        )}
        {!showHeading && <h2 id="schedule-heading" className="sr-only">{e.year} schedule</h2>}

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] items-start">
          <Card>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <ScheduleAgenda />
            </CardContent>
          </Card>
          <ScheduleGraphic className="lg:sticky lg:top-20" />
        </div>
      </div>
    </section>
  );
}
