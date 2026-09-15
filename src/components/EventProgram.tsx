import { Clock, MessageSquare, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NOSTR_VALLEY_2026, PANEL_2026, SPEAKERS_2026, TOPIC_TBA_LABEL } from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface EventProgramProps {
  className?: string;
}

/**
 * Talks and speakers for the annual event. Individual session times are
 * intentionally not shown until the organizers finalize the schedule.
 */
export function EventProgram({ className }: EventProgramProps) {
  return (
    <section id="program" className={cn('py-14 md:py-20 bg-muted/40', className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Program</h2>
            <p className="text-muted-foreground">
              {NOSTR_VALLEY_2026.dateLabel} &middot; {NOSTR_VALLEY_2026.timeLabel} &middot; {NOSTR_VALLEY_2026.venue}
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ul className="divide-y">
                {SPEAKERS_2026.map((speaker) => (
                  <li key={speaker.id} className="flex items-start gap-4 p-4 md:p-5">
                    <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('font-medium leading-snug', !speaker.talkTitle && 'text-muted-foreground italic')}>
                        {speaker.talkTitle ?? TOPIC_TBA_LABEL}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{speaker.name}</p>
                    </div>
                  </li>
                ))}
                <li className="flex items-start gap-4 p-4 md:p-5 bg-primary/5">
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">
                      {`${PANEL_2026.title} — ${PANEL_2026.topic ?? TOPIC_TBA_LABEL}`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {PANEL_2026.participants?.length
                        ? PANEL_2026.participants.map((p) => p.name).join(', ')
                        : 'Participants TBA'}
                    </p>
                  </div>
                </li>
              </ul>
              {!NOSTR_VALLEY_2026.scheduleFinalized && (
                <div className="border-t p-4 md:p-5 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30">
                  <Clock className="h-4 w-4 text-primary" />
                  Full schedule coming soon.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="outline" className="font-normal">Talks</Badge>
            <Badge variant="outline" className="font-normal">Panel</Badge>
            <Badge variant="outline" className="font-normal">Demos &amp; hallway track</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
