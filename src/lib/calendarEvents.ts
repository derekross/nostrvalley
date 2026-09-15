import type { NostrEvent } from '@nostrify/nostrify';
import { parseCalendarEvent } from '@/hooks/useCalendarEvents';

/** Start of a NIP-52 calendar event as a JS timestamp (ms). */
export function calendarEventStartMs(event: NostrEvent): number {
  const parsed = parseCalendarEvent(event);
  if (parsed.kind === 31922) {
    return new Date(parsed.start).getTime();
  }
  return parseInt(parsed.start) * 1000;
}

/** Local calendar date (YYYY-MM-DD) that a NIP-52 event starts on. */
export function calendarEventStartDate(event: NostrEvent, fallbackTimeZone?: string): string {
  const parsed = parseCalendarEvent(event);
  if (parsed.kind === 31922) {
    return parsed.start;
  }
  const date = new Date(parseInt(parsed.start) * 1000);
  // Time-based events may carry their own zone (NIP-52 `start_tzid`).
  const eventZone = event.tags.find(([name]) => name === 'start_tzid')?.[1];
  const zone = eventZone || fallbackTimeZone || 'UTC';
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
  } catch {
    // Unknown zone string on the event; fall back to UTC.
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
  }
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function isUpcomingCalendarEvent(event: NostrEvent, now: number = Date.now()): boolean {
  return calendarEventStartMs(event) >= now;
}

/**
 * Pick the NIP-52 event to attach RSVPs to.
 *
 * Prefers a published calendar event that starts on the given date (the
 * annual event), falling back to the next upcoming event so the RSVP button
 * keeps working before the organizers publish the 2026 calendar event.
 */
export function findEventForDate(
  events: NostrEvent[] | undefined,
  date: string,
  timeZone: string,
  now: number = Date.now(),
): NostrEvent | undefined {
  if (!events || events.length === 0) return undefined;

  const onDate = events.find((event) => calendarEventStartDate(event, timeZone) === date);
  if (onDate) return onDate;

  return events.find((event) => isUpcomingCalendarEvent(event, now));
}
