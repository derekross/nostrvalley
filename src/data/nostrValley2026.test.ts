import { describe, expect, it } from 'vitest';
import {
  NOSTR_VALLEY_2026,
  PANEL_2026,
  SPEAKERS_2026,
  npubToHex,
  speakerInitials,
} from './nostrValley2026';

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

  it('has not finalized the per-session schedule', () => {
    expect(NOSTR_VALLEY_2026.scheduleFinalized).toBe(false);
  });
});

describe('SPEAKERS_2026', () => {
  it('lists the seven announced speakers in order', () => {
    expect(SPEAKERS_2026.map((s) => s.name)).toEqual([
      'Arkinox',
      'Fundamentals',
      'Mani',
      'TKay',
      'Seth',
      'Derek',
      'Open Mike',
    ]);
  });

  it('uses unique ids', () => {
    const ids = SPEAKERS_2026.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('treats Open Mike as a person, not a session', () => {
    const openMike = SPEAKERS_2026.find((s) => s.id === 'open-mike');
    expect(openMike?.name).toBe('Open Mike');
    expect(openMike?.status).toBe('confirmed');
  });

  it('records announced talk titles and leaves TBA topics undefined', () => {
    const byId = Object.fromEntries(SPEAKERS_2026.map((s) => [s.id, s]));
    expect(byId.arkinox.talkTitle).toBe('Fanfares');
    expect(byId.fundamentals.talkTitle).toBe('Math Sovereignty');
    expect(byId.tkay.talkTitle).toBe('New Business Model');
    expect(byId.seth.talkTitle).toBe('Simplifying Nostr for User Experience');
    expect(byId.derek.talkTitle).toBe('The Concord Protocol');
    expect(byId.mani.talkTitle).toBeUndefined();
    expect(byId['open-mike'].talkTitle).toBeUndefined();
  });

  it('does not invent profile data', () => {
    for (const speaker of SPEAKERS_2026) {
      expect(speaker.pubkey).toBeUndefined();
      expect(speaker.image).toBeUndefined();
      expect(speaker.bio).toBeUndefined();
      expect(speaker.links).toBeUndefined();
    }
  });

  it('keeps the panel separate from the speaker list with topic TBA', () => {
    expect(PANEL_2026.title).toBe('Panel Discussion');
    expect(PANEL_2026.topic).toBeUndefined();
    expect(SPEAKERS_2026.some((s) => /panel/i.test(s.name))).toBe(false);
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
