import { useAuthor } from '@/hooks/useAuthor';
import type { Speaker, SpeakerLink } from '@/data/nostrValley2026';
import { nip19 } from 'nostr-tools';

export interface ResolvedSpeakerProfile {
  name: string;
  image?: string;
  bio?: string;
  links: SpeakerLink[];
  /** njump link to the speaker's Nostr profile, when a pubkey is known. */
  nostrProfileUrl?: string;
}

/**
 * Merge editorial speaker data with the speaker's Nostr profile (kind 0)
 * when a pubkey is configured. Editorial fields always win so organizers
 * can override anything on the site without touching Nostr.
 */
export function useSpeakerProfile(speaker: Speaker): ResolvedSpeakerProfile {
  const author = useAuthor(speaker.pubkey);
  const metadata = author.data?.metadata;

  const links: SpeakerLink[] = [...(speaker.links ?? [])];
  if (metadata?.website && !links.some((l) => l.url === metadata.website)) {
    links.push({ label: 'Website', url: metadata.website });
  }

  return {
    name: speaker.name,
    image: speaker.image ?? metadata?.picture,
    bio: speaker.bio ?? metadata?.about,
    links,
    nostrProfileUrl: speaker.pubkey
      ? `https://njump.me/${nip19.npubEncode(speaker.pubkey)}`
      : undefined,
  };
}
