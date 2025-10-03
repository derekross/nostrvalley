import { useSeoMeta } from '@unhead/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import Hls from 'hls.js';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation } from '@/components/Navigation';
import { useNostrValleyLiveEvents } from '@/hooks/useLiveEvents';
import { NOSTR_VALLEY_PUBKEY } from '@/hooks/useNostrValley';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { ZapButton } from '@/components/ZapButton';
import { ParticipantItem } from '@/components/ParticipantItem';

export default function LivePlayer() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const liveEvents = useNostrValleyLiveEvents();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Find the event by identifier (d tag)
  const event = liveEvents.data?.find(e => e.identifier === identifier);
  const author = useAuthor(event?.pubkey || '');
  const authorName = author.data?.metadata?.name ?? genUserName(event?.pubkey || '');

  // Determine video URL (streaming if live, recording if ended)
  const videoUrl = event?.status === 'live' ? event.streaming : event?.recording;

  // Create a synthetic event for zapping the Nostr Valley participant
  // This allows zaps to go to Nostr Valley instead of the event author
  const zapTargetEvent = useMemo(() => {
    if (!event) return null;
    return {
      ...event.rawEvent,
      pubkey: NOSTR_VALLEY_PUBKEY, // Override pubkey to zap Nostr Valley
    };
  }, [event]);

  useSeoMeta({
    title: event?.title ? `${event.title} - Nostr Valley Live` : 'Live Stream - Nostr Valley',
    description: event?.summary || 'Watch live stream from Nostr Valley',
  });

  // Initialize HLS.js for HLS streams
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;

    // Check if HLS stream (.m3u8)
    if (videoUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Auto-play might be blocked by browser
          });
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = videoUrl;
        video.play().catch(() => {
          // Auto-play might be blocked by browser
        });
      }
    } else {
      // Regular video file
      video.src = videoUrl;
    }
  }, [videoUrl]);

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

  if (liveEvents.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/live')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Live Events
          </Button>
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-bold mb-2">Stream Not Found</h2>
              <p className="text-muted-foreground">
                This live stream could not be found or is no longer available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'planned':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/live')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Live Events
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Player Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title || 'Stream preview'}
                        className="w-full h-full object-cover opacity-50"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg">
                        {event.status === 'planned' ? 'Stream not started yet' : 'Stream unavailable'}
                      </p>
                    </div>
                  </div>
                )}
                {event.status === 'live' && (
                  <div className="absolute top-4 left-4">
                    <Badge className={getStatusColor(event.status)}>
                      <span className="animate-pulse mr-1">●</span>
                      LIVE
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Stream Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold mb-2">{event.title || 'Untitled Stream'}</h1>
                      <p className="text-muted-foreground">Hosted by {authorName}</p>
                    </div>
                    {zapTargetEvent && <ZapButton target={zapTargetEvent} className="text-base" />}
                  </div>

                  {event.summary && (
                    <p className="text-foreground">{event.summary}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {event.currentParticipants !== undefined && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.currentParticipants} watching
                      </div>
                    )}
                    {event.starts && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.starts)}
                      </div>
                    )}
                  </div>

                  {event.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <CommentsSection
              root={event.rawEvent}
              title="Live Chat"
              emptyStateMessage="No messages yet"
              emptyStateSubtitle="Be the first to comment on this stream!"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Participants</h3>
                {event.participants.length > 0 ? (
                  <div className="space-y-2">
                    {event.participants.map((participant, i) => (
                      <ParticipantItem
                        key={i}
                        pubkey={participant.pubkey}
                        role={participant.role}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No participants listed</p>
                )}

                {event.totalParticipants !== undefined && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {event.totalParticipants} total participants
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
