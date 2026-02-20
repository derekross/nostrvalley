import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';

export function useNostrValleyFeed() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-feed'],
    queryFn: async (c) => {
      // Short deadline -- NPool returns partial results on abort,
      // so we get events from whichever relays responded fastest.
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);

      const events = await nostr.query([
        { kinds: [1], '#t': ['NostrValley'], limit: 50 },
        { kinds: [1], '#t': ['nostrvalley'], limit: 50 },
      ], { signal });

      // Sort by created_at descending (newest first)
      return events
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 20);
    },
  });
}

// Hook to get images/media from #NostrValley posts (including NIP-68 Picture events)
export function useNostrValleyMedia() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-media'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);

      const events = await nostr.query([
        { kinds: [1], '#t': ['NostrValley'], limit: 50 },
        { kinds: [1], '#t': ['nostrvalley'], limit: 50 },
        { kinds: [20], '#t': ['NostrValley'], limit: 30 },
        { kinds: [20], '#t': ['nostrvalley'], limit: 30 },
      ], { signal });

      // Filter events that contain media content
      const mediaEvents = events.filter((event) => {
        // For kind 20 (NIP-68), all events are picture events
        if (event.kind === 20) return true;

        // For kind 1, check for image URLs or imeta tags
        const hasImageUrl = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi)/i.test(event.content);
        const hasImetaTag = event.tags.some(tag => tag[0] === 'imeta');
        return hasImageUrl || hasImetaTag;
      });

      // Sort by created_at descending (newest first)
      return mediaEvents.sort((a, b) => b.created_at - a.created_at);
    },
  });
}
