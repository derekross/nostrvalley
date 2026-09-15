import { describe, expect, it } from 'vitest';
import { nip19 } from 'nostr-tools';
import { NOSTR_VALLEY_2026, SPEAKERS_2026, npubToHex, speakerInitials } from './nostrValley2026';

describe('NOSTR_VALLEY_2026', () => {
  it('describes the third annual event on October 17, 2026 in State College', () => {
    expect(NOSTR_VALLEY_2026.name).toBe('Nostr Valley III');
    expect(NOSTR_VALLEY_2026.edition).toBe(3);
    expect(NOSTR_VALLEY_2026.date).toBe('2026-10-17');
    expect(NOSTR_VALLEY_2026.startTime).toBe('12:00');
    expect(NOSTR_VALLEY_2026.endTime).toBe('16:00');
    expect(NOSTR_VALLEY_2026.venue).toBe('Happy Valley Brewing Company');
    expect(NOSTR_VALLEY_2026.city).toBe('State College');
    expect(NOSTR_VALLEY_2026.state).toBe('Pennsylvania');
  });

  it('has not finalized the schedule', () => {
    expect(NOSTR_VALLEY_2026.scheduleFinalized).toBe(false);
  });
});

describe('SPEAKERS_2026', () => {
  it('lists the eight announced speakers', () => {
    expect(SPEAKERS_2026.map((s) => s.name)).toEqual([
      'TKay',
      'Open Mike',
      'ManiMe',
      'Fundamentals',
      'Derek Ross',
      'Arkinox',
      'Seth',
      'The Daniel',
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
    };
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.status).toBe('confirmed');
      expect(speaker.pubkey).toMatch(/^[0-9a-f]{64}$/);
      expect(nip19.npubEncode(speaker.pubkey!)).toBe(expected[speaker.id]);
    }
  });

  it('treats Open Mike as a person, not a session', () => {
    expect(SPEAKERS_2026.find((s) => s.id === 'open-mike')?.name).toBe('Open Mike');
  });

  it('does not list talk topics yet', () => {
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.talkTitle).toBeUndefined();
    }
  });
});

describe('helpers', () => {
  it('derives initials from one- and two-word names', () => {
    expect(speakerInitials('Seth')).toBe('SE');
    expect(speakerInitials('Open Mike')).toBe('OM');
    expect(speakerInitials('  ')).toBe('?');
  });

  it('converts an npub to hex', () => {
    expect(
      npubToHex('npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny'),
    ).toMatch(/^[0-9a-f]{64}$/);
    expect(() => npubToHex('note1abc')).toThrow();
  });
});
