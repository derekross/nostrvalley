import { describe, expect, it } from 'vitest';
import { nip19 } from 'nostr-tools';
import {
  NOSTR_VALLEY_2026,
  PANEL_2026,
  SCHEDULE_2026,
  SPEAKERS_2026,
  durationMinutes,
  formatClock,
  formatTimeRange,
  npubToHex,
  speakerInitials,
} from './nostrValley2026';

describe('NOSTR_VALLEY_2026', () => {
  it('describes the third annual event on October 17, 2026 in State College', () => {
    expect(NOSTR_VALLEY_2026.name).toBe('Nostr Valley III');
    expect(NOSTR_VALLEY_2026.edition).toBe(3);
    expect(NOSTR_VALLEY_2026.date).toBe('2026-10-17');
    expect(NOSTR_VALLEY_2026.startTime).toBe('11:45');
    expect(NOSTR_VALLEY_2026.endTime).toBe('16:10');
    expect(NOSTR_VALLEY_2026.venue).toBe('Happy Valley Brewing Company');
    expect(NOSTR_VALLEY_2026.city).toBe('State College');
    expect(NOSTR_VALLEY_2026.state).toBe('Pennsylvania');
  });

  it('has published the schedule', () => {
    expect(NOSTR_VALLEY_2026.scheduleFinalized).toBe(true);
  });
});

describe('SPEAKERS_2026', () => {
  it('lists the nine announced speakers in display order', () => {
    expect(SPEAKERS_2026.map((s) => s.name)).toEqual([
      'Arkinox',
      'Fundamentals',
      'ManiMe',
      'TKay',
      'Seth',
      'Derek Ross',
      'Open Mike',
      'The Daniel',
      'David Strayhorn',
    ]);
  });

  it('uses unique ids and pubkeys', () => {
    const ids = SPEAKERS_2026.map((s) => s.id);
    const pubkeys = SPEAKERS_2026.map((s) => s.pubkey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(pubkeys).size).toBe(pubkeys.length);
  });

  it('has a confirmed hex pubkey for every speaker', () => {
    const expected: Record<string, string> = {
      tkay: 'npub1nje4ghpkjsxe5thcd4gdt3agl2usxyxv3xxyx39ul3xgytl5009q87l02j',
      'open-mike': 'npub1a6c3jcdj23ptzcuflek8a04f4hc2cdkat95pd6n3r8jjrwyzrw0q43lfrr',
      manime: 'npub1manlnflyzyjhgh970t8mmngrdytcp3jrmaa66u846ggg7t20cgqqvyn9tn',
      fundamentals: 'npub12eml5kmtrjmdt0h8shgg32gye5yqsf2jha6a70jrqt82q9d960sspky99g',
      'derek-ross': 'npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424',
      arkinox: 'npub1arkn0xxxll4llgy9qxkrncn3vc4l69s0dz8ef3zadykcwe7ax3dqrrh43w',
      seth: 'npub15u3cqhx6vuj3rywg0ph5mfv009lxja6cyvqn2jagaydukq6zmjwqex05rq',
      'the-daniel': 'npub1aeh2zw4elewy5682lxc6xnlqzjnxksq303gwu2npfaxd49vmde6qcq4nwx',
      straycat: 'npub1u5njm6g5h5cpw4wy8xugu62e5s7f6fnysv0sj0z3a8rengt2zqhsxrldq3',
    };
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.status).toBe('confirmed');
      expect(speaker.pubkey).toMatch(/^[0-9a-f]{64}$/);
      expect(nip19.npubEncode(speaker.pubkey!)).toBe(expected[speaker.id]);
    }
  });

  it('does not list talk titles', () => {
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.talkTitle).toBeUndefined();
    }
  });

  it('treats Open Mike as a person, not a session', () => {
    expect(SPEAKERS_2026.find((s) => s.id === 'open-mike')?.name).toBe('Open Mike');
  });

  it('does not invent editorial profile data', () => {
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.image).toBeUndefined();
      expect(speaker.bio).toBeUndefined();
      expect(speaker.links).toBeUndefined();
    }
  });

  it('keeps the panel separate from the speaker list', () => {
    expect(PANEL_2026.title).toBe('Panel Discussion');
    expect(PANEL_2026.topic).toBe('Vibe Check: The State of Nostr Culture');
    expect(PANEL_2026.participants?.map((s) => s.id)).toEqual(['open-mike', 'derek-ross', 'arkinox', 'seth']);
    expect(SPEAKERS_2026.some((s) => /panel/i.test(s.name))).toBe(false);
  });
});

describe('SCHEDULE_2026', () => {
  it('runs back to back from doors to close', () => {
    expect(SCHEDULE_2026[0].start).toBe(NOSTR_VALLEY_2026.startTime);
    expect(SCHEDULE_2026.at(-1)!.end).toBe(NOSTR_VALLEY_2026.endTime);
    for (let i = 1; i < SCHEDULE_2026.length; i++) {
      expect(SCHEDULE_2026[i].start).toBe(SCHEDULE_2026[i - 1].end);
    }
  });

  it('gives every speaker exactly one numbered talk', () => {
    const talks = SCHEDULE_2026.filter((item) => item.kind === 'talk');
    expect(talks.map((t) => t.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, talks.length));
    const talkSpeakers = talks.flatMap((t) => t.speakers ?? []).map((s) => s.id).sort();
    const nonPanelists = SPEAKERS_2026.filter((s) => s.id !== 'open-mike').map((s) => s.id).sort();
    expect(talkSpeakers).toEqual(nonPanelists);
    for (const talk of talks) {
      expect(durationMinutes(talk.start, talk.end)).toBe(25);
    }
  });

  it('includes the panel as a 30-minute slot', () => {
    const panel = SCHEDULE_2026.find((item) => item.kind === 'panel')!;
    expect(panel.title).toBe(PANEL_2026.topic);
    expect(durationMinutes(panel.start, panel.end)).toBe(30);
  });
});

describe('helpers', () => {
  it('derives initials from one- and two-word names', () => {
    expect(speakerInitials('Seth')).toBe('SE');
    expect(speakerInitials('Open Mike')).toBe('OM');
    expect(speakerInitials('  ')).toBe('?');
  });

  it('formats clock times and ranges', () => {
    expect(formatClock('11:45')).toBe('11:45 AM');
    expect(formatClock('12:05')).toBe('12:05 PM');
    expect(formatClock('16:10')).toBe('4:10 PM');
    expect(formatTimeRange('11:45', '12:05')).toBe('11:45 AM – 12:05 PM');
    expect(formatTimeRange('12:10', '12:35')).toBe('12:10 – 12:35 PM');
    expect(formatTimeRange('15:30', '16:00')).toBe('3:30 – 4:00 PM');
  });

  it('converts an npub to hex', () => {
    expect(
      npubToHex('npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny'),
    ).toMatch(/^[0-9a-f]{64}$/);
    expect(() => npubToHex('note1abc')).toThrow();
  });
});
