import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { multiRelayQuery } from '@/lib/nostrUtils';

export function useNostrValleyFeed() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-feed'],
    queryFn: async (_c) => {
      console.log('Fetching Nostr Valley feed from multiple relays...');

      // Query for posts with #NostrValley or #nostrvalley hashtag from across the ecosystem
      const events = await multiRelayQuery(nostr, [{
        kinds: [1], // Short text notes
        '#t': ['NostrValley'], // Search for NostrValley
        limit: 50
      }, {
        kinds: [1], // Short text notes
        '#t': ['nostrvalley'], // Search for nostrvalley (lowercase)
        limit: 50
      }], { timeout: 5000, maxRelays: 4 });

      // Remove duplicates and sort by created_at descending (newest first)
      const uniqueEvents = events.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
      );

      return uniqueEvents
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 20); // Return only the latest 20
    },
  });
}

// Hook to get images/media from #NostrValley posts (including NIP-68 Picture events)
export function useNostrValleyMedia() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-media'],
    queryFn: async (_c) => {
      console.log('Fetching Nostr Valley media from multiple relays...');

      // Query for posts with #NostrValley or #nostrvalley hashtag that contain media
      const events = await multiRelayQuery(nostr, [{
        kinds: [1], // Short text notes
        '#t': ['NostrValley'], // Search for NostrValley
        limit: 100
      }, {
        kinds: [1], // Short text notes
        '#t': ['nostrvalley'], // Search for nostrvalley (lowercase)
        limit: 100
      }, {
        kinds: [20], // NIP-68 Picture events
        '#t': ['NostrValley'], // Search for NostrValley
        limit: 50
      }, {
        kinds: [20], // NIP-68 Picture events
        '#t': ['nostrvalley'], // Search for nostrvalley (lowercase)
        limit: 50
      }], { timeout: 6000, maxRelays: 4 });

      // Remove duplicates first
      const uniqueEvents = events.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
      );

      // Filter events that contain media content
      const mediaEvents = uniqueEvents.filter((event: NostrEvent) => {
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