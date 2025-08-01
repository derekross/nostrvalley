import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { useNostr } from '@nostrify/react';

const NOSTR_VALLEY_NPUB = 'npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny';

// Decode the npub to get the hex pubkey
const decoded = nip19.decode(NOSTR_VALLEY_NPUB);
if (decoded.type !== 'npub') {
  throw new Error('Invalid npub provided');
}
export const NOSTR_VALLEY_PUBKEY = decoded.data;

export function useNostrValley() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr-valley-profile', NOSTR_VALLEY_PUBKEY],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);
      
      // Get profile metadata and recent notes from Nostr Valley account
      const [metadataEvents, noteEvents] = await Promise.all([
        nostr.query([{ 
          kinds: [0], 
          authors: [NOSTR_VALLEY_PUBKEY],
          limit: 1
        }], { signal }),
        nostr.query([{ 
          kinds: [1], 
          authors: [NOSTR_VALLEY_PUBKEY],
          limit: 20
        }], { signal })
      ]);

      return {
        pubkey: NOSTR_VALLEY_PUBKEY,
        metadata: metadataEvents[0] ? JSON.parse(metadataEvents[0].content) : null,
        notes: noteEvents
      };
    },
  });
}