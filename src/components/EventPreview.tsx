import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { nip19 } from 'nostr-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageCircle, Repeat2 } from 'lucide-react';
import { NoteContent } from './NoteContent';

interface EventPreviewProps {
  neventId: string;
  className?: string;
}

function useEventFromNevent(neventId: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['event-preview', neventId],
    queryFn: async () => {
      try {
        const decoded = nip19.decode(neventId);
        if (decoded.type !== 'nevent') {
          throw new Error('Invalid nevent');
        }

        const { id: eventId, author } = decoded.data;
        
        const filter: { ids: string[]; authors?: string[] } = { ids: [eventId] };
        if (author) filter.authors = [author];

        const events = await nostr.query([filter], { 
          signal: AbortSignal.timeout(3000)
        });

        return events[0] || null;
      } catch (error) {
        console.error('Failed to fetch event:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function EventPreview({ neventId, className }: EventPreviewProps) {
  const { data: event, isLoading, error } = useEventFromNevent(neventId);
  const author = useAuthor(event?.pubkey || '');

  if (isLoading) {
    return (
      <Card className={`border-l-4 border-l-blue-500 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-3 bg-muted rounded w-16 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !event) {
    return (
      <Card className={`border-l-4 border-l-red-500 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">Unable to load event</span>
            <a
              href={`https://njump.me/${neventId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm ml-auto"
            >
              View on njump.me →
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  const authorName = author.data?.metadata?.name ?? genUserName(event.pubkey);
  const authorImage = author.data?.metadata?.picture;

  const getEventTypeInfo = (kind: number) => {
    switch (kind) {
      case 1:
        return { icon: MessageCircle, label: 'Note', color: 'text-blue-500' };
      case 6:
        return { icon: Repeat2, label: 'Repost', color: 'text-green-500' };
      case 7:
        return { icon: MessageCircle, label: 'Reaction', color: 'text-yellow-500' };
      default:
        return { icon: MessageCircle, label: `Kind ${kind}`, color: 'text-gray-500' };
    }
  };

  const { icon: Icon, label, color } = getEventTypeInfo(event.kind);

  return (
    <Card className={`border-l-4 border-l-blue-500 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <a
                href={`https://njump.me/${nip19.npubEncode(event.pubkey)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm hover:underline"
              >
                {authorName}
              </a>
              <Badge variant="outline" className="text-xs">
                <Icon className={`h-3 w-3 mr-1 ${color}`} />
                {label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(event.created_at * 1000), { addSuffix: true })}</span>
              <a
                href={`https://njump.me/${neventId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        {event.content && (
          <div className="text-sm leading-relaxed">
            {event.kind === 1 ? (
              <NoteContent event={event} className="text-sm" />
            ) : (
              <div className="text-muted-foreground italic">
                {event.content.slice(0, 200)}
                {event.content.length > 200 && '...'}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}