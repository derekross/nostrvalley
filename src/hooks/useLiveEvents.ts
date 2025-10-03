import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { NOSTR_VALLEY_PUBKEY } from './useNostrValley';

/**
 * Validates a NIP-53 live event (kind 30311)
 */
function validateLiveEvent(event: NostrEvent): boolean {
  if (event.kind !== 30311) return false;

  // Check for required 'd' tag
  const d = event.tags.find(([name]) => name === 'd')?.[1];
  if (!d) return false;

  return true;
}

/**
 * Parses a NIP-53 live event into a structured format
 */
export interface ParsedLiveEvent {
  id: string;
  pubkey: string;
  identifier: string;
  title?: string;
  summary?: string;
  image?: string;
  streaming?: string;
  recording?: string;
  starts?: number;
  ends?: number;
  status?: 'planned' | 'live' | 'ended';
  currentParticipants?: number;
  totalParticipants?: number;
  participants: Array<{
    pubkey: string;
    relay?: string;
    role?: string;
    proof?: string;
  }>;
  relays: string[];
  hashtags: string[];
  rawEvent: NostrEvent;
}

export function parseLiveEvent(event: NostrEvent): ParsedLiveEvent {
  const d = event.tags.find(([name]) => name === 'd')?.[1] || '';
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  const summary = event.tags.find(([name]) => name === 'summary')?.[1];
  const image = event.tags.find(([name]) => name === 'image')?.[1];
  const streaming = event.tags.find(([name]) => name === 'streaming')?.[1];
  const recording = event.tags.find(([name]) => name === 'recording')?.[1];
  const starts = event.tags.find(([name]) => name === 'starts')?.[1];
  const ends = event.tags.find(([name]) => name === 'ends')?.[1];
  const status = event.tags.find(([name]) => name === 'status')?.[1] as 'planned' | 'live' | 'ended' | undefined;
  const currentParticipants = event.tags.find(([name]) => name === 'current_participants')?.[1];
  const totalParticipants = event.tags.find(([name]) => name === 'total_participants')?.[1];

  // Parse participants (p tags)
  const participants = event.tags
    .filter(([name]) => name === 'p')
    .map(([_, pubkey, relay, role, proof]) => ({
      pubkey,
      relay: relay || undefined,
      role: role || undefined,
      proof: proof || undefined,
    }));

  // Parse relays
  const relaysTag = event.tags.find(([name]) => name === 'relays');
  const relays = relaysTag ? relaysTag.slice(1) : [];

  // Parse hashtags
  const hashtags = event.tags
    .filter(([name]) => name === 't')
    .map(([_, tag]) => tag);

  return {
    id: event.id,
    pubkey: event.pubkey,
    identifier: d,
    title,
    summary,
    image,
    streaming,
    recording,
    starts: starts ? parseInt(starts) : undefined,
    ends: ends ? parseInt(ends) : undefined,
    status,
    currentParticipants: currentParticipants ? parseInt(currentParticipants) : undefined,
    totalParticipants: totalParticipants ? parseInt(totalParticipants) : undefined,
    participants,
    relays,
    hashtags,
    rawEvent: event,
  };
}

/**
 * Hook to fetch live events from Nostr Valley account
 */
export function useNostrValleyLiveEvents() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-live-events'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);

      // Query for NIP-53 live streaming events (kind 30311) from Nostr Valley
      const events = await nostr.query(
        [
          {
            kinds: [30311],
            authors: [NOSTR_VALLEY_PUBKEY],
            limit: 50,
          },
        ],
        { signal }
      );

      // Filter and parse valid live events
      return events
        .filter(validateLiveEvent)
        .map(parseLiveEvent)
        .sort((a, b) => {
          // Sort by status: live > planned > ended
          const statusOrder = { live: 0, planned: 1, ended: 2 };
          const aOrder = statusOrder[a.status || 'ended'];
          const bOrder = statusOrder[b.status || 'ended'];

          if (aOrder !== bOrder) return aOrder - bOrder;

          // Within same status, sort by start time (most recent first)
          const aTime = a.starts || 0;
          const bTime = b.starts || 0;
          return bTime - aTime;
        });
    },
  });
}
