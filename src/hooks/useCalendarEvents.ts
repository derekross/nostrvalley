import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { NOSTR_VALLEY_PUBKEY } from './useNostrValley';
import { multiRelayQuery } from '@/lib/nostrUtils';

// Validator function for NIP-52 calendar events
function validateCalendarEvent(event: NostrEvent): boolean {
  // Check if it's a calendar event kind
  if (![31922, 31923].includes(event.kind)) return false;

  // Check for required tags according to NIP-52
  const d = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  const start = event.tags.find(([name]) => name === 'start')?.[1];

  // All calendar events require 'd', 'title', and 'start' tags
  if (!d || !title || !start) return false;

  // Additional validation for date-based events (kind 31922)
  if (event.kind === 31922) {
    // start tag should be in YYYY-MM-DD format for date-based events
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start)) return false;
  }

  // Additional validation for time-based events (kind 31923)
  if (event.kind === 31923) {
    // start tag should be a unix timestamp for time-based events
    const timestamp = parseInt(start);
    if (isNaN(timestamp) || timestamp <= 0) return false;
  }

  return true;
}

export function useNostrValleyEvents() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-events'],
    queryFn: async (_c) => {
      console.log('Fetching Nostr Valley calendar events from multiple relays...');

      // Query for calendar events from Nostr Valley account or tagged with NostrValley
      const events = await multiRelayQuery(nostr, [{
        kinds: [31922, 31923], // Date-based and time-based calendar events
        authors: [NOSTR_VALLEY_PUBKEY],
        limit: 50
      }, {
        kinds: [31922, 31923],
        '#t': ['NostrValley', 'nostrvalley'], // Also get events tagged with NostrValley
        limit: 50
      }], { timeout: 5000, maxRelays: 4 });

      // Filter events through validator to ensure they meet NIP-52 requirements
      const validEvents = events.filter(validateCalendarEvent);

      // Sort by start date/time
      return validEvents.sort((a, b) => {
        const startA = a.tags.find(([name]) => name === 'start')?.[1];
        const startB = b.tags.find(([name]) => name === 'start')?.[1];

        if (!startA || !startB) return 0;

        // For date-based events, compare dates
        if (a.kind === 31922 && b.kind === 31922) {
          return startA.localeCompare(startB);
        }

        // For time-based events, compare timestamps
        if (a.kind === 31923 && b.kind === 31923) {
          return parseInt(startA) - parseInt(startB);
        }

        // Mixed comparison: convert date to timestamp for comparison
        if (a.kind === 31922 && b.kind === 31923) {
          const dateA = new Date(startA).getTime() / 1000;
          const timestampB = parseInt(startB);
          return dateA - timestampB;
        }

        if (a.kind === 31923 && b.kind === 31922) {
          const timestampA = parseInt(startA);
          const dateB = new Date(startB).getTime() / 1000;
          return timestampA - dateB;
        }

        return 0;
      });
    },
  });
}

// Helper function to parse calendar event data
export function parseCalendarEvent(event: NostrEvent) {
  const tags = Object.fromEntries(event.tags.map(([key, value]) => [key, value]));

  return {
    id: tags.d,
    title: tags.title,
    summary: tags.summary,
    start: tags.start,
    end: tags.end,
    location: event.tags.filter(([key]) => key === 'location').map(([, value]) => value),
    image: tags.image,
    kind: event.kind,
    content: event.content,
    pubkey: event.pubkey,
    created_at: event.created_at,
    participants: event.tags.filter(([key]) => key === 'p').map(([, pubkey, relay, role]) => ({
      pubkey,
      relay,
      role
    })),
    hashtags: event.tags.filter(([key]) => key === 't').map(([, tag]) => tag),
    references: event.tags.filter(([key]) => key === 'r').map(([, url]) => url)
  };
}