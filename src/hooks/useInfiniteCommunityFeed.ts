import { useInfiniteQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { NOSTR_VALLEY_PUBKEY } from './useNostrValley';
import { multiRelayQuery } from '@/lib/nostrUtils';

interface FeedPage {
  events: NostrEvent[];
  nextCursor?: number;
}

export function useInfiniteCommunityFeed() {
  const { nostr } = useNostr();

  return useInfiniteQuery<FeedPage>({
    queryKey: ['infinite-community-feed'],
    queryFn: async ({ pageParam = Math.floor(Date.now() / 1000), signal: _signal }) => {
      const cursor = pageParam as number;
      console.log('Fetching community feed from multiple relays...');

      // Query for multiple types of content:
      // 1. Posts with #NostrValley hashtags
      // 2. Posts from official Nostr Valley account
      // 3. NIP-68 Picture events with hashtags
      const events = await multiRelayQuery(nostr, [
        // Hashtag content - kind 1 (text notes)
        {
          kinds: [1],
          '#t': ['NostrValley'],
          until: cursor,
          limit: 15
        },
        {
          kinds: [1],
          '#t': ['nostrvalley'],
          until: cursor,
          limit: 15
        },
        // Official account content - kind 1 (text notes)
        {
          kinds: [1],
          authors: [NOSTR_VALLEY_PUBKEY],
          until: cursor,
          limit: 10
        },
        // Hashtag content - kind 20 (NIP-68 Picture events)
        {
          kinds: [20],
          '#t': ['NostrValley'],
          until: cursor,
          limit: 10
        },
        {
          kinds: [20],
          '#t': ['nostrvalley'],
          until: cursor,
          limit: 10
        },
        // Official account media - kind 20 (NIP-68 Picture events)
        {
          kinds: [20],
          authors: [NOSTR_VALLEY_PUBKEY],
          until: cursor,
          limit: 5
        }
      ], { timeout: 8000, maxRelays: 5 });

      // Remove duplicates based on event ID
      const uniqueEvents = events.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
      );

      // Sort by created_at descending (newest first)
      const sortedEvents = uniqueEvents.sort((a, b) => b.created_at - a.created_at);

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
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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