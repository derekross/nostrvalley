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
  timeLabel: '11:45 AM – 4:10 PM',
  startTime: '11:45',
  endTime: '16:10',
  timeZone: 'America/New_York',
  venue: 'Happy Valley Brewing Company',
  city: 'State College',
  state: 'Pennsylvania',
  locationShort: 'State College, PA',
  locationLong: 'State College, Pennsylvania',
  tagline: 'Nostr. Bitcoin. Builders. An annual gathering in Happy Valley.',
  scheduleFinalized: true,
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
    status: 'confirmed',
    pubkey: npubToHex('npub1arkn0xxxll4llgy9qxkrncn3vc4l69s0dz8ef3zadykcwe7ax3dqrrh43w'),
  },
  {
    id: 'fundamentals',
    name: 'Fundamentals',
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
    status: 'confirmed',
    pubkey: npubToHex('npub1nje4ghpkjsxe5thcd4gdt3agl2usxyxv3xxyx39ul3xgytl5009q87l02j'),
  },
  {
    id: 'seth',
    name: 'Seth',
    status: 'confirmed',
    pubkey: npubToHex('npub15u3cqhx6vuj3rywg0ph5mfv009lxja6cyvqn2jagaydukq6zmjwqex05rq'),
  },
  {
    id: 'derek-ross',
    name: 'Derek Ross',
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
  {
    id: 'straycat',
    name: 'David Strayhorn',
    status: 'confirmed',
    pubkey: npubToHex('npub1u5njm6g5h5cpw4wy8xugu62e5s7f6fnysv0sj0z3a8rengt2zqhsxrldq3'),
  },
];

function speakersById(...ids: string[]): Speaker[] {
  return ids.map((id) => {
    const speaker = SPEAKERS_2026.find((s) => s.id === id);
    if (!speaker) throw new Error(`Unknown speaker id: ${id}`);
    return speaker;
  });
}

/** The panel discussion, shown separately from the individual talks. */
export const PANEL_2026: PanelSession = {
  title: 'Panel Discussion',
  topic: 'Vibe Check: The State of Nostr Culture',
  participants: speakersById('open-mike', 'derek-ross', 'arkinox', 'seth'),
};

export type ScheduleItemKind = 'logistics' | 'talk' | 'panel';

export interface ScheduleItem {
  /** Stable identifier used for React keys. */
  id: string;
  kind: ScheduleItemKind;
  /** Local start and end times as HH:MM (24h), venue time zone. */
  start: string;
  end: string;
  title: string;
  /** Talk number as printed on the lineup graphic (talks only). */
  number?: number;
  /** Speakers or hosts for this slot, in display order. */
  speakers?: Speaker[];
}

/** The published 2026 run of show, in order. Mirrors /nostr-valley-schedule.png. */
export const SCHEDULE_2026: ScheduleItem[] = [
  { id: 'doors', kind: 'logistics', start: '11:45', end: '12:05', title: 'Doors, arrival, check-in' },
  {
    id: 'welcome',
    kind: 'logistics',
    start: '12:05',
    end: '12:10',
    title: 'Welcome',
    speakers: speakersById('derek-ross', 'seth'),
  },
  {
    id: 'talk-seth',
    kind: 'talk',
    number: 1,
    start: '12:10',
    end: '12:35',
    title: 'Nobody Joins a Protocol — What We Learned Building Zap Cooking',
    speakers: speakersById('seth'),
  },
  {
    id: 'talk-straycat',
    kind: 'talk',
    number: 2,
    start: '12:35',
    end: '13:00',
    title: 'Brainstorm: Search Through the People You Trust',
    speakers: speakersById('straycat'),
  },
  {
    id: 'talk-derek-ross',
    kind: 'talk',
    number: 3,
    start: '13:00',
    end: '13:25',
    title: "Something You're Passionate About and Other Stuff",
    speakers: speakersById('derek-ross'),
  },
  {
    id: 'talk-the-daniel',
    kind: 'talk',
    number: 4,
    start: '13:25',
    end: '13:50',
    title: "Don't Lose Your Shit: Defending Your Profile Data from Rogue Clients",
    speakers: speakersById('the-daniel'),
  },
  {
    id: 'talk-manime',
    kind: 'talk',
    number: 5,
    start: '13:50',
    end: '14:15',
    title: 'Bots Need Nostr Even More Than We Do',
    speakers: speakersById('manime'),
  },
  {
    id: 'talk-fundamentals',
    kind: 'talk',
    number: 6,
    start: '14:15',
    end: '14:40',
    title: 'Math sovereignty',
    speakers: speakersById('fundamentals'),
  },
  {
    id: 'talk-tkay',
    kind: 'talk',
    number: 7,
    start: '14:40',
    end: '15:05',
    title: 'The Curious Pair: A Podcast Vending Machine',
    speakers: speakersById('tkay'),
  },
  {
    id: 'talk-arkinox',
    kind: 'talk',
    number: 8,
    start: '15:05',
    end: '15:30',
    title: 'Sell Your Content, Not Your Soul',
    speakers: speakersById('arkinox'),
  },
  {
    id: 'panel',
    kind: 'panel',
    start: '15:30',
    end: '16:00',
    title: PANEL_2026.topic!,
    speakers: PANEL_2026.participants,
  },
  {
    id: 'close',
    kind: 'logistics',
    start: '16:00',
    end: '16:10',
    title: 'Close',
    speakers: speakersById('derek-ross', 'seth'),
  },
];

/** Footnote printed under the run of show. */
export const SCHEDULE_FOOTNOTE = 'Talk slots include a 3-minute speaker changeover.';

/** Path of the shareable lineup graphic in /public. */
export const SCHEDULE_IMAGE_URL = '/nostr-valley-schedule.png';

function parseClock(time: string): { hour: number; minute: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) throw new Error(`Expected HH:MM, received ${time}`);
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/** "13:05" → "1:05 PM". */
export function formatClock(time: string): string {
  const { hour, minute } = parseClock(time);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** "12:10"–"12:35" → "12:10 – 12:35 PM"; spans across noon keep both meridiems. */
export function formatTimeRange(start: string, end: string): string {
  const [startLabel, startMeridiem] = formatClock(start).split(' ');
  const endLabel = formatClock(end);
  return endLabel.endsWith(startMeridiem)
    ? `${startLabel} – ${endLabel}`
    : `${startLabel} ${startMeridiem} – ${endLabel}`;
}

/** Slot length in minutes. */
export function durationMinutes(start: string, end: string): number {
  const a = parseClock(start);
  const b = parseClock(end);
  return b.hour * 60 + b.minute - (a.hour * 60 + a.minute);
}

/** Shown wherever the schedule would go until session times are announced. */
export const SCHEDULE_TBA_LABEL = 'Full schedule coming soon.';

/** Initials used by the branded avatar fallback (max two characters). */
export function speakerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
