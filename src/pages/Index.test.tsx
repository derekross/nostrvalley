import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestApp } from '@/test/TestApp';
import { SCHEDULE_2026, SPEAKERS_2026 } from '@/data/nostrValley2026';
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
    expect(screen.getAllByText('11:45 AM – 4:10 PM').length).toBeGreaterThan(0);

    // Where
    expect(screen.getAllByText('Happy Valley Brewing Company').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/State College, Pennsylvania/).length).toBeGreaterThan(0);

    // Who
    for (const speaker of SPEAKERS_2026) {
      expect(screen.getAllByText(speaker.name).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('Panel Discussion')).toBeInTheDocument();

    // What next
    expect(screen.getAllByRole('button', { name: /RSVP with Nostr/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Meet the Speakers/i })).toHaveAttribute('href', '#speakers');
  });

  it('shows the 2026 run of show with the lineup graphic', () => {
    render(
      <TestApp>
        <Index />
      </TestApp>,
    );

    expect(screen.queryByText('Full schedule coming soon.')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Schedule' })).toBeInTheDocument();
    for (const item of SCHEDULE_2026) {
      expect(screen.getAllByText(item.title).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('11:45 AM – 12:05 PM')).toBeInTheDocument();
    expect(screen.getByText('3:30 – 4:00 PM')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /lineup graphic/i })).toHaveAttribute('src', '/nostr-valley-schedule.png');
    expect(screen.getByRole('link', { name: /View the Schedule/i })).toHaveAttribute('href', '#schedule');
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
