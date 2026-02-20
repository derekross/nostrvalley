import React, { useEffect, useRef } from 'react';
import { NostrEvent, NPool, NRelay1 } from '@nostrify/nostrify';
import { NostrContext } from '@nostrify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/hooks/useAppContext';

interface NostrProviderProps {
  children: React.ReactNode;
}

const READ_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.ditto.pub',
  'wss://relay.primal.net',
];

const NostrProvider: React.FC<NostrProviderProps> = (props) => {
  const { children } = props;
  const { config } = useAppContext();

  const queryClient = useQueryClient();
  const pool = useRef<NPool | undefined>(undefined);
  const relayUrls = useRef<string[]>(READ_RELAYS);

  // Update relay list when config changes, keeping selected relay first
  useEffect(() => {
    relayUrls.current = [
      config.relayUrl,
      ...READ_RELAYS.filter(url => url !== config.relayUrl),
    ];
    queryClient.resetQueries();
  }, [config.relayUrl, queryClient]);

  if (!pool.current) {
    pool.current = new NPool({
      open(url: string) {
        return new NRelay1(url);
      },
      reqRouter(filters) {
        // Fan out reads to all relays in parallel.
        // NPool deduplicates events and returns partial results on abort,
        // so callers use a short AbortSignal.timeout() as a deadline.
        const relayMap = new Map<string, typeof filters>();
        for (const url of relayUrls.current) {
          relayMap.set(url, filters);
        }
        return relayMap;
      },
      eventRouter(_event: NostrEvent) {
        return relayUrls.current;
      },
    });
  }

  return (
    <NostrContext.Provider value={{ nostr: pool.current }}>
      {children}
    </NostrContext.Provider>
  );
};

export default NostrProvider;
