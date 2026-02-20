import { useInfiniteQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { NOSTR_VALLEY_PUBKEY } from './useNostrValley';

interface FeedPage {
  events: NostrEvent[];
  nextCursor?: number;
}

export function useInfiniteCommunityFeed() {
  const { nostr } = useNostr();

  return useInfiniteQuery<FeedPage>({
    queryKey: ['infinite-community-feed'],
    queryFn: async ({ pageParam = Math.floor(Date.now() / 1000), signal }) => {
      const cursor = pageParam as number;
      // Short deadline -- NPool returns partial results on abort
      const querySignal = AbortSignal.any([signal, AbortSignal.timeout(1500)]);
      const events = await nostr.query([
        // Hashtag content (text notes + picture events)
        {
          kinds: [1, 20],
          '#t': ['NostrValley', 'nostrvalley'],
          until: cursor,
          limit: 30,
        },
        // Official account content
        {
          kinds: [1, 20],
          authors: [NOSTR_VALLEY_PUBKEY],
          until: cursor,
          limit: 15,
        },
      ], { signal: querySignal });

      // Sort by created_at descending (newest first)
      const sortedEvents = events.sort((a, b) => b.created_at - a.created_at);

      // Determine next cursor (oldest event timestamp minus 1 second)
      const nextCursor = sortedEvents.length > 0
        ? sortedEvents[sortedEvents.length - 1].created_at - 1
        : undefined;

      return {
        events: sortedEvents,
        nextCursor
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: Math.floor(Date.now() / 1000),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

// Helper hook to get all events from all pages
export function useInfiniteCommunityFeedEvents() {
  const query = useInfiniteCommunityFeed();

  const allEvents = query.data?.pages.flatMap(page => page.events) ?? [];

  return {
    ...query,
    events: allEvents
  };
}
