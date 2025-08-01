import type { NostrEvent } from '@nostrify/nostrify';
import type { Filter } from 'nostr-tools';

// List of major relays to try for comprehensive content fetching
const MAJOR_RELAYS = [
  'wss://relay.nostr.band',
  'wss://ditto.pub/relay',
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.snort.social'
];

/**
 * Multi-relay query utility that fetches from multiple relays and aggregates results
 * @param nostr Nostr instance from useNostr hook
 * @param filters Nostr filters to query
 * @param options Configuration options
 * @returns Promise with aggregated events from all relays
 */
export async function multiRelayQuery(
  nostr: { query: (filters: Filter[], options: { signal?: AbortSignal }) => Promise<NostrEvent[]> },
  filters: Filter[],
  options: {
    timeout?: number;
    maxRelays?: number;
    deduplicate?: boolean;
  } = {}
): Promise<NostrEvent[]> {
  const {
    timeout = 3000,
    maxRelays = 4,
    deduplicate = true
  } = options;

  const relaysToTry = MAJOR_RELAYS.slice(0, maxRelays);
  const allEvents: NostrEvent[] = [];
  const errors: string[] = [];

  // Try each relay sequentially with individual timeouts
  for (const relayUrl of relaysToTry) {
    try {
      console.log(`Querying relay: ${relayUrl} with filters:`, filters);

      const events = await nostr.query(filters, {
        signal: AbortSignal.timeout(timeout)
      });

      console.log(`Found ${events.length} events from ${relayUrl}`);
      allEvents.push(...events);

    } catch (error) {
      const errorMessage = `Failed to query ${relayUrl}: ${error}`;
      console.warn(errorMessage);
      errors.push(errorMessage);
    }
  }

  // Remove duplicates if requested
  if (deduplicate) {
    const uniqueEvents = allEvents.filter((event, index, self) =>
      index === self.findIndex(e => e.id === event.id)
    );
    console.log(`Total unique events: ${uniqueEvents.length} (from ${allEvents.length} raw events)`);
    return uniqueEvents;
  }

  console.log(`Total events: ${allEvents.length} (duplicates included)`);
  return allEvents;
}

/**
 * Hook-friendly multi-relay query function for React Query
 */
export function createMultiRelayQuery(
  nostr: { query: (filters: Filter[], options: { signal?: AbortSignal }) => Promise<NostrEvent[]> },
  timeout?: number
) {
  return async (filters: Filter[], _signal?: AbortSignal) => {
    return multiRelayQuery(nostr, filters, { timeout: timeout || 3000 });
  };
}