/**
 * Editorial data for Nostr Valley III (the third annual Nostr Valley).
 *
 * This file is the single source of truth for the announced 2026 lineup.
 * Speaker profiles on Nostr (kind 0) are fetched at render time when a
 * `pubkey` is present, so the fields below only need to hold what has
 * been confirmed by the organizers. Leave a field out rather than guessing.
 *
 * To add a speaker's Nostr profile later, set `pubkey` to their hex pubkey
 * (or use `npubToHex` below with their npub). Picture, bio, and website will
 * then be pulled from their Nostr profile automatically unless overridden
 * here with `image`, `bio`, or `links`.
 */

import { nip19 } from 'nostr-tools';

export type SpeakerStatus = 'confirmed' | 'tba';

export interface SpeakerLink {
  label: string;
  url: string;
}

export interface Speaker {
  /** Stable identifier used for React keys and anchors. */
  id: string;
  /** Display name or handle exactly as it should appear on the site. */
  name: string;
  /** Talk title. Omit when the talk has not been announced. */
  talkTitle?: string;
  /** Whether the speaker is confirmed for the lineup. */
  status: SpeakerStatus;
  /** Hex pubkey. When present, profile data is fetched from Nostr. */
  pubkey?: string;
  /** Explicit image URL. Overrides the Nostr profile picture when set. */
  image?: string;
  /** Explicit bio. Overrides the Nostr profile "about" when set. */
  bio?: string;
  /** Extra links (website, project, etc). */
  links?: SpeakerLink[];
}

export interface PanelSession {
  title: string;
  /** Topic description. Omit while the topic is still to be announced. */
  topic?: string;
  /** Panelists, when announced. */
  participants?: Speaker[];
}

export interface AnnualEvent {
  /** Short event name, e.g. "Nostr Valley III". */
  name: string;
  /** Longer descriptive name, e.g. "Third Annual Nostr Valley". */
  subtitle: string;
  /** Which annual edition this is (1-based). */
  edition: number;
  year: number;
  /** ISO calendar date (YYYY-MM-DD) in the venue's local time zone. */
  date: string;
  /** Human-readable date. */
  dateLabel: string;
  /** Human-readable time range. */
  timeLabel: string;
  /** Local start and end times as HH:MM (24h), venue time zone. */
  startTime: string;
  endTime: string;
  /** IANA time zone of the venue. */
  timeZone: string;
  venue: string;
  city: string;
  state: string;
  /** Short location, e.g. "State College, PA". */
  locationShort: string;
  /** Long location, e.g. "State College, Pennsylvania". */
  locationLong: string;
  /** One-line positioning statement used in the hero and metadata. */
  tagline: string;
  /** True once the per-session schedule has been published. */
  scheduleFinalized: boolean;
}

/** Convert an npub to the hex pubkey used throughout the app. */
export function npubToHex(npub: string): string {
  const decoded = nip19.decode(npub);
  if (decoded.type !== 'npub') {
    throw new Error(`Expected an npub, received ${decoded.type}`);
  }
  return decoded.data;
}

export const NOSTR_VALLEY_2026: AnnualEvent = {
  name: 'Nostr Valley III',
  subtitle: 'Third Annual Nostr Valley',
  edition: 3,
  year: 2026,
  date: '2026-10-17',
  dateLabel: 'October 17, 2026',
  timeLabel: '12:00 PM – 4:00 PM',
  startTime: '12:00',
  endTime: '16:00',
  timeZone: 'America/New_York',
  venue: 'Happy Valley Brewing Company',
  city: 'State College',
  state: 'Pennsylvania',
  locationShort: 'State College, PA',
  locationLong: 'State College, Pennsylvania',
  tagline: 'Nostr. Bitcoin. Builders. An annual gathering in Happy Valley.',
  scheduleFinalized: false,
};

/**
 * Announced 2026 speakers, in the order they should be displayed.
 *
 * Note: "Open Mike" is a person's handle and a featured speaker,
 * not an open-mic session.
 */
export const SPEAKERS_2026: Speaker[] = [
  {
    id: 'arkinox',
    name: 'Arkinox',
    talkTitle: 'Fanfares',
    status: 'confirmed',
    pubkey: npubToHex('npub1arkn0xxxll4llgy9qxkrncn3vc4l69s0dz8ef3zadykcwe7ax3dqrrh43w'),
  },
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    talkTitle: 'Math Sovereignty',
    status: 'confirmed',
    pubkey: npubToHex('npub12eml5kmtrjmdt0h8shgg32gye5yqsf2jha6a70jrqt82q9d960sspky99g'),
  },
  {
    id: 'manime',
    name: 'ManiMe',
    status: 'confirmed',
    pubkey: npubToHex('npub1manlnflyzyjhgh970t8mmngrdytcp3jrmaa66u846ggg7t20cgqqvyn9tn'),
  },
  {
    id: 'tkay',
    name: 'TKay',
    talkTitle: 'New Business Model',
    status: 'confirmed',
    pubkey: npubToHex('npub1nje4ghpkjsxe5thcd4gdt3agl2usxyxv3xxyx39ul3xgytl5009q87l02j'),
  },
  {
    id: 'seth',
    name: 'Seth',
    talkTitle: 'Simplifying Nostr for User Experience',
    status: 'confirmed',
    pubkey: npubToHex('npub15u3cqhx6vuj3rywg0ph5mfv009lxja6cyvqn2jagaydukq6zmjwqex05rq'),
  },
  {
    id: 'derek-ross',
    name: 'Derek Ross',
    talkTitle: 'The Concord Protocol',
    status: 'confirmed',
    pubkey: npubToHex('npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424'),
  },
  {
    id: 'open-mike',
    name: 'Open Mike',
    status: 'confirmed',
    pubkey: npubToHex('npub1a6c3jcdj23ptzcuflek8a04f4hc2cdkat95pd6n3r8jjrwyzrw0q43lfrr'),
  },
  {
    id: 'the-daniel',
    name: 'The Daniel',
    status: 'confirmed',
    pubkey: npubToHex('npub1aeh2zw4elewy5682lxc6xnlqzjnxksq303gwu2npfaxd49vmde6qcq4nwx'),
  },
];

/** The panel discussion, shown separately from the individual talks. */
export const PANEL_2026: PanelSession = {
  title: 'Panel Discussion',
};

/** Label shown for a speaker whose talk has not been announced yet. */
export const TALK_TBA_LABEL = 'Talk TBA';

/** Shown wherever the schedule would go until session times are announced. */
export const SCHEDULE_TBA_LABEL = 'Full schedule coming soon.';

/** Initials used by the branded avatar fallback (max two characters). */
export function speakerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
