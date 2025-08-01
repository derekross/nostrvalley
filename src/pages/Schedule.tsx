import { useSeoMeta } from '@unhead/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation } from '@/components/Navigation';
import { NoteContent } from '@/components/NoteContent';
import { useNostrValleyEvents, parseCalendarEvent } from '@/hooks/useCalendarEvents';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import type { NostrEvent } from '@nostrify/nostrify';

function EventCard({ event }: { event: NostrEvent }) {
  const parsedEvent = parseCalendarEvent(event);
  const author = useAuthor(event.pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(event.pubkey);

  const formatEventDate = (start: string, kind: number) => {
    if (kind === 31922) {
      // Date-based event
      return new Date(start).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // Time-based event
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
  const isUpcoming = parsedEvent.kind === 31922 
    ? new Date(parsedEvent.start) >= new Date() 
    : parseInt(parsedEvent.start) * 1000 >= Date.now();

  return (
    <Card className="event-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
                <Calendar className="h-4 w-4" />
                {typeof eventDateTime === 'string' ? eventDateTime : eventDateTime.date}
              </div>
              
              {typeof eventDateTime === 'object' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {eventDateTime.time}
                  {endTime && ` - ${endTime}`}
                </div>
              )}
              
              {parsedEvent.location.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
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
            <h4 className="font-medium mb-2">Description</h4>
            <div className="text-sm">
              <NoteContent event={event} />
            </div>
          </div>
        )}
        
        {parsedEvent.participants.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants ({parsedEvent.participants.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {parsedEvent.participants.map((participant, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {participant.role || 'Participant'}
                </Badge>
              ))}
            </div>
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

  useSeoMeta({
    title: 'Schedule - Nostr Valley',
    description: 'Complete schedule of Nostr Valley conference events, talks, and activities.',
  });

  const upcomingEvents = events.data?.filter(event => {
    const parsedEvent = parseCalendarEvent(event);
    return parsedEvent.kind === 31922 
      ? new Date(parsedEvent.start) >= new Date() 
      : parseInt(parsedEvent.start) * 1000 >= Date.now();
  }) || [];

  const pastEvents = events.data?.filter(event => {
    const parsedEvent = parseCalendarEvent(event);
    return parsedEvent.kind === 31922 
      ? new Date(parsedEvent.start) < new Date() 
      : parseInt(parsedEvent.start) * 1000 < Date.now();
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Conference Schedule</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete schedule of Nostr Valley events, talks, workshops, and networking activities
          </p>
        </div>

        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Upcoming Events
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
                Past Events
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
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-lg font-semibold mb-2">No events scheduled yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  The conference schedule will be published here as events are confirmed.
                </p>
                <div className="bg-muted rounded-lg p-4 max-w-sm mx-auto">
                  <p className="text-sm text-muted-foreground">
                    <strong>Stay tuned:</strong> Follow our official channels for schedule updates
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}