import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestApp } from '@/test/TestApp';
import Index from './Index';

describe('Index', () => {
  it('answers what, when, where, and who above the fold', () => {
    render(
      <TestApp>
        <Index />
      </TestApp>,
    );

    // What
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Nostr Valley\s*III/i);
    expect(screen.getAllByText('Third Annual Nostr Valley').length).toBeGreaterThan(0);

    // When
    expect(screen.getAllByText('October 17, 2026').length).toBeGreaterThan(0);
    expect(screen.getAllByText('12:00 PM – 4:00 PM').length).toBeGreaterThan(0);

    // Where
    expect(screen.getAllByText('Happy Valley Brewing Company').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/State College, Pennsylvania/).length).toBeGreaterThan(0);

    // Who
    for (const name of ['Arkinox', 'Fundamentals', 'Mani', 'TKay', 'Seth', 'Derek', 'Open Mike']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText(/Panel Discussion/).length).toBeGreaterThan(0);

    // RSVP is present
    expect(screen.getAllByRole('button', { name: /RSVP with Nostr/i }).length).toBeGreaterThan(0);
  });

  it('shows the program without session times', () => {
    render(
      <TestApp>
        <Index />
      </TestApp>,
    );

    expect(screen.getByText('Full schedule coming soon.')).toBeInTheDocument();
    expect(screen.getAllByText('Topic TBA').length).toBeGreaterThan(0);
    // No per-talk clock times like "1:30 PM" anywhere on the page besides the event window.
    const clockTimes = screen.queryAllByText(/\b\d{1,2}:\d{2}\s?(AM|PM)\b/);
    expect(clockTimes.every((el) => el.textContent?.includes('12:00 PM – 4:00 PM'))).toBe(true);
  });

  it('no longer describes Nostr Valley as a monthly meetup', () => {
    const { container } = render(
      <TestApp>
        <Index />
      </TestApp>,
    );

    expect(container.textContent).not.toMatch(/monthly/i);
    expect(container.textContent).not.toMatch(/regular gatherings/i);
    expect(container.textContent).toMatch(/annual/i);
    expect(container.textContent).toMatch(/Past Nostr Valleys/);
  });
});
