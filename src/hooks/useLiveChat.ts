import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';

/**
 * Hook to fetch NIP-53 live chat messages (kind 1311) for a live event
 * @param eventCoordinate - The 'a' tag coordinate (kind:pubkey:d-tag) of the live event
 * @param limit - Maximum number of messages to fetch
 */
export function useLiveChat(eventCoordinate: string, limit = 100) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['live-chat', eventCoordinate],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);

      // Query for NIP-53 live chat messages (kind 1311) that reference this event
      const events = await nostr.query(
        [
          {
            kinds: [1311],
            '#a': [eventCoordinate],
            limit,
          },
        ],
        { signal }
      );

      // Sort by created_at (oldest first for chat experience)
      return events.sort((a, b) => a.created_at - b.created_at);
    },
    // Refetch every 3 seconds for live updates
    refetchInterval: 3000,
  });
}
