import { describe, expect, it } from 'vitest';
import type { NostrEvent } from '@nostrify/nostrify';
import {
  calendarEventStartDate,
  findEventForDate,
  isUpcomingCalendarEvent,
} from './calendarEvents';

function dateEvent(id: string, start: string): NostrEvent {
  return {
    id,
    kind: 31922,
    pubkey: 'a'.repeat(64),
    created_at: 0,
    content: '',
    sig: '',
    tags: [['d', id], ['title', id], ['start', start]],
  };
}

function timeEvent(id: string, startUnix: number, tzid?: string): NostrEvent {
  const tags = [['d', id], ['title', id], ['start', String(startUnix)]];
  if (tzid) tags.push(['start_tzid', tzid]);
  return {
    id,
    kind: 31923,
    pubkey: 'a'.repeat(64),
    created_at: 0,
    content: '',
    sig: '',
    tags,
  };
}

// 2026-10-17T16:00:00Z is noon in America/New_York (EDT, UTC-4).
const NOON_OCT_17_2026_ET = Date.UTC(2026, 9, 17, 16, 0, 0) / 1000;

describe('calendarEventStartDate', () => {
  it('returns the start tag for date-based events', () => {
    expect(calendarEventStartDate(dateEvent('x', '2026-10-17'))).toBe('2026-10-17');
  });

  it('resolves time-based events in the venue zone', () => {
    expect(
      calendarEventStartDate(timeEvent('x', NOON_OCT_17_2026_ET), 'America/New_York'),
    ).toBe('2026-10-17');
  });

  it('prefers the event start_tzid when present', () => {
    // 03:00 UTC on Oct 18 is still Oct 17 in New York.
    const lateNightUtc = Date.UTC(2026, 9, 18, 3, 0, 0) / 1000;
    expect(calendarEventStartDate(timeEvent('x', lateNightUtc, 'America/New_York'), 'UTC'))
      .toBe('2026-10-17');
  });
});

describe('findEventForDate', () => {
  const now = Date.UTC(2026, 8, 15) ; // Sept 15, 2026

  it('returns undefined with no events', () => {
    expect(findEventForDate(undefined, '2026-10-17', 'America/New_York', now)).toBeUndefined();
    expect(findEventForDate([], '2026-10-17', 'America/New_York', now)).toBeUndefined();
  });

  it('prefers the event that starts on the annual event date', () => {
    const events = [
      dateEvent('earlier', '2026-10-01'),
      timeEvent('nviii', NOON_OCT_17_2026_ET),
      dateEvent('later', '2026-11-01'),
    ];
    expect(findEventForDate(events, '2026-10-17', 'America/New_York', now)?.id).toBe('nviii');
  });

  it('falls back to the next upcoming event', () => {
    const events = [dateEvent('past', '2025-10-18'), dateEvent('next', '2026-10-01')];
    expect(findEventForDate(events, '2026-10-17', 'America/New_York', now)?.id).toBe('next');
  });

  it('returns undefined when everything is in the past and none match', () => {
    const events = [dateEvent('past', '2025-10-18')];
    expect(findEventForDate(events, '2026-10-17', 'America/New_York', now)).toBeUndefined();
  });
});

describe('isUpcomingCalendarEvent', () => {
  it('compares against the provided now', () => {
    const now = Date.UTC(2026, 8, 15);
    expect(isUpcomingCalendarEvent(dateEvent('a', '2026-10-17'), now)).toBe(true);
    expect(isUpcomingCalendarEvent(dateEvent('b', '2025-10-18'), now)).toBe(false);
  });
});
