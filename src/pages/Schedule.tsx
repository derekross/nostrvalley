import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from '@/components/Layout';
import { NoteContent } from '@/components/NoteContent';
import { RSVPDialog } from '@/components/RSVPDialog';
import { EventFacts } from '@/components/EventFacts';
import { ScheduleNote } from '@/components/FeaturedSpeakers';
import { useNostrValleyEvents, parseCalendarEvent } from '@/hooks/useCalendarEvents';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { findEventForDate, isUpcomingCalendarEvent } from '@/lib/calendarEvents';
import { MEETUP_URL } from '@/lib/links';
import { NOSTR_VALLEY_2026 } from '@/data/nostrValley2026';
import type { NostrEvent } from '@nostrify/nostrify';

function EventCard({ event }: { event: NostrEvent }) {
  const parsedEvent = parseCalendarEvent(event);
  const author = useAuthor(event.pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(event.pubkey);

  const formatEventDate = (start: string, kind: number) => {
    if (kind === 31922) {
      return new Date(start).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      const date = new Date(parseInt(start) * 1000);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };
    }
  };

  const formatEndTime = (end: string, kind: number) => {
    if (kind === 31923 && end) {
      const date = new Date(parseInt(end) * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return null;
  };

  const eventDateTime = formatEventDate(parsedEvent.start, parsedEvent.kind);
  const endTime = parsedEvent.end ? formatEndTime(parsedEvent.end, parsedEvent.kind) : null;
  const isUpcoming = isUpcomingCalendarEvent(event);

  return (
    <Card className={`event-card ${isUpcoming ? 'border-primary/20' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={isUpcoming ? "default" : "secondary"} className="text-xs">
                {isUpcoming ? "Upcoming" : "Past"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {parsedEvent.kind === 31922 ? 'All Day' : 'Scheduled'}
              </Badge>
            </div>
            <CardTitle className="text-xl mb-3">{parsedEvent.title}</CardTitle>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {typeof eventDateTime === 'string' ? eventDateTime : eventDateTime.date}
              </div>
              
              {typeof eventDateTime === 'object' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {eventDateTime.time}
                  {endTime && ` - ${endTime}`}
                </div>
              )}
              
              {parsedEvent.location.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {parsedEvent.location[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {parsedEvent.summary && (
          <p className="text-muted-foreground mb-4">{parsedEvent.summary}</p>
        )}
        
        {parsedEvent.content && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Description</h4>
            <div className="text-sm">
              <NoteContent event={event} />
            </div>
          </div>
        )}
        
        {/* Registration buttons for upcoming events */}
        {isUpcoming && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4 p-4 bg-primary/5 rounded-lg">
            <RSVPDialog calendarEvent={event}>
              <Button size="sm">
                RSVP with Nostr
              </Button>
            </RSVPDialog>
            <Button variant="outline" size="sm" asChild>
              <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Register on Meetup.com
              </a>
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
          <span>Organized by {authorName}</span>
          {parsedEvent.hashtags.length > 0 && (
            <div className="flex gap-1">
              {parsedEvent.hashtags.slice(0, 3).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Schedule() {
  const events = useNostrValleyEvents();

  const e = NOSTR_VALLEY_2026;

  useSeoMeta({
    title: `Events · ${e.name}`,
    description: `${e.name} is ${e.dateLabel}, ${e.timeLabel} at ${e.venue} in ${e.locationLong}. Plus past Nostr Valley annual events.`,
  });

  const upcomingEvents = events.data?.filter(event => isUpcomingCalendarEvent(event)) || [];
  const pastEvents = events.data?.filter(event => !isUpcomingCalendarEvent(event)) || [];
  const rsvpEvent = findEventForDate(events.data, e.date, e.timeZone);

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 hero-gradient opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The annual Nostr Valley gathering, plus the archive of past years. RSVP with Nostr or register on Meetup.com.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-10 max-w-3xl mx-auto">
          {/* This year's annual event */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              This Year
            </h2>
            <Card className="overflow-hidden border-primary/30 shadow-lg">
              <CardContent className="p-0">
                <div className="gradient-bg p-6 md:p-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">{e.subtitle}</p>
                  <h3 className="text-2xl md:text-3xl font-bold">{e.name}</h3>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <EventFacts compact />
                  <p className="text-muted-foreground">{e.tagline}</p>
                  <ScheduleNote />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <RSVPDialog calendarEvent={rsvpEvent}>
                      <Button>RSVP with Nostr</Button>
                    </RSVPDialog>
                    <Button variant="outline" asChild>
                      <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register on Meetup.com
                      </a>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/speakers">
                        Speakers
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Upcoming on Nostr
              </h2>
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                Past Nostr Valleys
              </h2>
              <div className="grid gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Loading State */}
          {events.isLoading && (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
                    <div className="space-y-2 mt-3">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!events.isLoading && events.data && events.data.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-16 px-8 text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="text-lg font-semibold mb-2">No calendar events on Nostr yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  The Nostr calendar event for {e.name} will appear here once it's published.
                </p>
                <Button asChild>
                  <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join on Meetup.com for Notifications
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
