import React from 'react';
import { useSeoMeta } from '@unhead/react';
import { Users, Hash, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NoteContent } from '@/components/NoteContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Layout } from '@/components/Layout';
import { useInfiniteCommunityFeedEvents } from '@/hooks/useInfiniteCommunityFeed';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { extractMediaFromEvent, type MediaItem } from '@/lib/mediaUtils';
import { formatDistanceToNow } from 'date-fns';
import { nip19 } from 'nostr-tools';
import type { NostrEvent } from '@nostrify/nostrify';

function MediaDisplay({ media }: { media: MediaItem[] }) {
  if (media.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      {media.map((item, index) => (
        <div key={index} className="rounded-lg overflow-hidden bg-muted/30">
          {item.type === 'image' ? (
            <img 
              src={item.url} 
              alt={item.alt || 'Shared image'}
              className="w-full max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          ) : item.type === 'video' ? (
            <div className="relative group">
              <video 
                src={item.url}
                className="w-full max-h-96 object-contain"
                controls
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Play className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm break-all"
              >
                {item.url}
              </a>
            </div>
          )}
          {item.title && (
            <div className="p-3 bg-muted/50">
              <p className="text-sm font-medium">{item.title}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PostCard({ event }: { event: NostrEvent }) {
  const author = useAuthor(event.pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(event.pubkey);
  const authorImage = author.data?.metadata?.picture;
  const npub = nip19.npubEncode(event.pubkey);
  const nevent = nip19.neventEncode({ id: event.id, author: event.pubkey });
  const hasRealName = !!author.data?.metadata?.name;
  
  const media = extractMediaFromEvent(event);
  const title = event.kind === 20 ? event.tags.find(tag => tag[0] === 'title')?.[1] : null;

  return (
    <Card className="post-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <a
            href={`https://njump.me/${npub}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </a>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <a
                href={`https://njump.me/${npub}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold text-sm hover:underline ${
                  hasRealName 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {authorName}
              </a>
              {event.kind === 20 && (
                <Badge variant="secondary" className="text-xs">Photo</Badge>
              )}
              <a
                href={`https://njump.me/${nevent}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {formatDistanceToNow(new Date(event.created_at * 1000), { addSuffix: true })}
              </a>
            </div>
            
            {title && (
              <h3 className="font-medium text-base mb-2">{title}</h3>
            )}
            
            {event.content && (
              <div className="text-sm leading-relaxed mb-3">
                {event.kind === 20 ? (
                  <div className="whitespace-pre-wrap break-words">{event.content}</div>
                ) : (
                  <NoteContent event={event} hiddenUrls={media.map(m => m.url)} />
                )}
              </div>
            )}
            
            <MediaDisplay media={media} />
            
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">NostrValley</span>
              {media.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  &bull; {media.length} media item{media.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Community() {
  const feed = useInfiniteCommunityFeedEvents();
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px'
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = feed;
  React.useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useSeoMeta({
    title: 'Community Feed - Nostr Valley',
    description: 'Latest posts from the Nostr Valley community. Meetup recaps, discussions, and content from our local Nostr and Bitcoin community in Happy Valley, PA.',
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Community Feed</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Posts from the Nostr Valley community -- meetup recaps, discussions, and updates from across the Nostr network
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div>
            {feed.isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : feed.events && feed.events.length > 0 ? (
              <div className="space-y-6">
                {feed.events.map((event) => (
                  <PostCard key={event.id} event={event} />
                ))}
                
                <div ref={loadMoreRef} className="h-4" />
                
                {feed.hasNextPage && (
                  <div className="flex justify-center pt-6">
                    {feed.isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading more posts...
                      </div>
                    ) : (
                      <Button
                        onClick={() => feed.fetchNextPage()}
                        variant="outline"
                        className="w-full max-w-xs"
                      >
                        Load More Posts
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-16 px-8 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                  <h3 className="text-lg font-semibold mb-2">No community posts yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Be the first to share something with the #NostrValley hashtag!
                  </p>
                  <div className="bg-muted rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Use #NostrValley or #nostrvalley in your Nostr posts to appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
