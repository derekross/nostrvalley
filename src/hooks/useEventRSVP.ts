import { useMutation, useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useNostrPublish } from './useNostrPublish';
import { useCurrentUser } from './useCurrentUser';
import type { NostrEvent } from '@nostrify/nostrify';
import { NOSTR_VALLEY_PUBKEY } from './useNostrValley';

export type RSVPStatus = 'accepted' | 'declined' | 'tentative';
export type RSVPFreeBusy = 'free' | 'busy';

interface RSVPData {
  calendarEventId: string; // Event ID of the calendar event
  calendarEventCoordinates: string; // Addressable event coordinates (kind:pubkey:d-tag)
  status: RSVPStatus;
  freeBusy?: RSVPFreeBusy;
  note?: string;
}

// Hook to create/update an RSVP
export function useCreateRSVP() {
  const { mutate: publishEvent } = useNostrPublish();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async (rsvpData: RSVPData) => {
      if (!user) {
        throw new Error('User must be logged in to RSVP');
      }

      // Generate unique identifier for this RSVP
      const rsvpId = `rsvp-${rsvpData.calendarEventId}-${Date.now()}`;
      
      // Build tags for the RSVP event
      const tags: string[][] = [
        ['d', rsvpId], // Required unique identifier
        ['a', rsvpData.calendarEventCoordinates], // Required calendar event coordinates
        ['e', rsvpData.calendarEventId], // Optional specific event ID
        ['status', rsvpData.status], // Required RSVP status
        ['p', NOSTR_VALLEY_PUBKEY], // Tag the event organizer for easy querying
      ];

      // Add free/busy status if provided and status is not declined
      if (rsvpData.freeBusy && rsvpData.status !== 'declined') {
        tags.push(['fb', rsvpData.freeBusy]);
      }

      // Publish the RSVP event
      return new Promise<void>((resolve, reject) => {
        publishEvent({
          kind: 31925, // NIP-52 Calendar Event RSVP
          content: rsvpData.note || '', // Optional note
          tags,
        }, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
  });
}

// Hook to get user's existing RSVPs
export function useUserRSVPs(userPubkey?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['user-rsvps', userPubkey],
    queryFn: async (c) => {
      if (!userPubkey) return [];
      
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);
      
      // Query for user's RSVP events
      const events = await nostr.query([{
        kinds: [31925], // Calendar Event RSVP
        authors: [userPubkey],
        limit: 50
      }], { signal });

      return events;
    },
    enabled: !!userPubkey,
  });
}

// Hook to get RSVPs for a specific calendar event
export function useEventRSVPs(calendarEventCoordinates: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['event-rsvps', calendarEventCoordinates],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(1500)]);
      
      // Query for RSVPs to this specific calendar event
      const events = await nostr.query([{
        kinds: [31925], // Calendar Event RSVP
        '#a': [calendarEventCoordinates], // Filter by calendar event coordinates
        limit: 200
      }], { signal });

      return events;
    },
  });
}

// Hook to check if user has RSVP'd to a specific event
export function useUserEventRSVP(calendarEventCoordinates: string, userPubkey?: string) {
  const userRSVPs = useUserRSVPs(userPubkey);

  const userRSVP = userRSVPs.data?.find(rsvp => 
    rsvp.tags.some(tag => tag[0] === 'a' && tag[1] === calendarEventCoordinates)
  );

  const status = userRSVP?.tags.find(tag => tag[0] === 'status')?.[1] as RSVPStatus | undefined;
  const freeBusy = userRSVP?.tags.find(tag => tag[0] === 'fb')?.[1] as RSVPFreeBusy | undefined;

  return {
    hasRSVPd: !!userRSVP,
    rsvp: userRSVP,
    status,
    freeBusy,
    note: userRSVP?.content,
    isLoading: userRSVPs.isLoading,
  };
}

// Utility function to create calendar event coordinates
export function createCalendarEventCoordinates(event: NostrEvent): string {
  const dTag = event.tags.find(tag => tag[0] === 'd')?.[1];
  if (!dTag) {
    throw new Error('Calendar event missing d tag');
  }
  return `${event.kind}:${event.pubkey}:${dTag}`;
}

// Utility function to parse RSVP event
export function parseRSVPEvent(rsvpEvent: NostrEvent) {
  const status = rsvpEvent.tags.find(tag => tag[0] === 'status')?.[1] as RSVPStatus | undefined;
  const freeBusy = rsvpEvent.tags.find(tag => tag[0] === 'fb')?.[1] as RSVPFreeBusy | undefined;
  const calendarEventCoordinates = rsvpEvent.tags.find(tag => tag[0] === 'a')?.[1];
  const calendarEventId = rsvpEvent.tags.find(tag => tag[0] === 'e')?.[1];
  const organizerPubkey = rsvpEvent.tags.find(tag => tag[0] === 'p')?.[1];

  return {
    status,
    freeBusy,
    calendarEventCoordinates,
    calendarEventId,
    organizerPubkey,
    note: rsvpEvent.content,
    rsvpId: rsvpEvent.tags.find(tag => tag[0] === 'd')?.[1],
    createdAt: rsvpEvent.created_at,
    pubkey: rsvpEvent.pubkey,
  };
}