import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { Radio, Clock, Users, Play, Calendar, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useNostrValleyLiveEvents, type ParsedLiveEvent } from '@/hooks/useLiveEvents';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';

function LiveEventCard({ event }: { event: ParsedLiveEvent }) {
  const author = useAuthor(event.pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(event.pubkey);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'planned':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'live':
        return <Radio className="h-3 w-3 animate-pulse" />;
      case 'planned':
        return <Calendar className="h-3 w-3" />;
      case 'ended':
        return <Play className="h-3 w-3" />;
      default:
        return <Play className="h-3 w-3" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      {event.image && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={event.image}
            alt={event.title || 'Live event'}
            className="object-cover w-full h-full"
          />
          {event.status === 'live' && (
            <div className="absolute top-3 left-3">
              <Badge className={getStatusColor(event.status)}>
                <Radio className="h-3 w-3 animate-pulse mr-1" />
                LIVE
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(event.status)}>
                {getStatusIcon(event.status)}
                <span className="ml-1 capitalize">{event.status || 'Unknown'}</span>
              </Badge>
              {event.currentParticipants !== undefined && (
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {event.currentParticipants} watching
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{event.title || 'Untitled Live Event'}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {event.summary && (
          <p className="text-muted-foreground text-sm">{event.summary}</p>
        )}

        {event.starts && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDate(event.starts)}
          </div>
        )}

        {event.participants.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Participants
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.participants.slice(0, 5).map((participant, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {participant.role || 'Participant'}
                </Badge>
              ))}
              {event.participants.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{event.participants.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {event.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.hashtags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link to={`/live/${event.identifier}`}>
              {event.status === 'live' && (
                <>
                  <Radio className="h-4 w-4 mr-2" />
                  Watch Live
                </>
              )}
              {event.status === 'planned' && (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Details
                </>
              )}
              {event.status === 'ended' && (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Watch Recording
                </>
              )}
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
          <span>Hosted by {authorName}</span>
          {event.totalParticipants !== undefined && (
            <span>{event.totalParticipants} total participants</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Live() {
  const liveEvents = useNostrValleyLiveEvents();

  useSeoMeta({
    title: 'Live - Nostr Valley',
    description: 'Live streams and recordings from Nostr Valley meetups and events.',
  });

  const liveNow = liveEvents.data?.filter(event => event.status === 'live') || [];
  const upcoming = liveEvents.data?.filter(event => event.status === 'planned') || [];
  const past = liveEvents.data?.filter(event => event.status === 'ended') || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Live Events</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch live streams and recordings from Nostr Valley meetups and events
          </p>
        </div>

        <div className="space-y-8">
          {/* Live Now */}
          {liveNow.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Radio className="h-6 w-6 text-red-500 animate-pulse" />
                Live Now
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveNow.map((event) => (
                  <LiveEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Upcoming
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <LiveEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Past Streams */}
          {past.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Play className="h-6 w-6 text-muted-foreground" />
                Past Streams
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <LiveEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Event Archive - YouTube Playlist */}
          {!liveEvents.isLoading && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Event Archive
              </h2>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/videoseries?list=PLTQJ1TiXFu42cVsvpJ2jwKetZ6kzA-YYx"
                      title="Nostr Valley Event Archive"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Watch recordings from past Nostr Valley meetups and events
                    </p>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <a
                        href="https://www.youtube.com/playlist?list=PLTQJ1TiXFu42cVsvpJ2jwKetZ6kzA-YYx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        View Full Playlist on YouTube
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Loading State */}
          {liveEvents.isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <div className="aspect-video w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
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
          {!liveEvents.isLoading && liveEvents.data && liveEvents.data.length === 0 && (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="py-12 px-8 text-center">
                  <div className="max-w-sm mx-auto space-y-6">
                    <Radio className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                    <h3 className="text-lg font-semibold mb-2">No live events yet</h3>
                    <p className="text-muted-foreground">
                      Live streams and events will appear here when they're scheduled.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
