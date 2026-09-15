import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestApp } from '@/test/TestApp';
import { FeaturedSpeakerCard, FeaturedSpeakers, PanelCard, ScheduleNote } from './FeaturedSpeakers';
import { PANEL_2026, SPEAKERS_2026, type Speaker } from '@/data/nostrValley2026';

describe('FeaturedSpeakers', () => {
  it('renders every announced speaker, the panel, and the schedule note', () => {
    render(
      <TestApp>
        <FeaturedSpeakers />
      </TestApp>,
    );

    for (const speaker of SPEAKERS_2026) {
      expect(screen.getByText(speaker.name)).toBeInTheDocument();
    }
    expect(screen.getByText('Fanfares')).toBeInTheDocument();
    expect(screen.getByText('The Concord Protocol')).toBeInTheDocument();
    expect(screen.getAllByText('Talk TBA')).toHaveLength(3);
    expect(screen.getByText('Panel Discussion')).toBeInTheDocument();
    expect(screen.getByText('Topic & participants coming soon.')).toBeInTheDocument();
    expect(screen.getByText('Full schedule coming soon.')).toBeInTheDocument();
    // No speaker count in the supporting copy.
    expect(screen.queryByText(/\b(eight|8) speakers/i)).not.toBeInTheDocument();
  });

  it('treats Open Mike as a speaker linked to their Nostr profile', () => {
    const openMike = SPEAKERS_2026.find((s) => s.id === 'open-mike')!;
    render(
      <TestApp>
        <FeaturedSpeakerCard speaker={openMike} />
      </TestApp>,
    );

    const link = screen.getByRole('link', { name: 'Open Mike' });
    expect(link).toHaveAttribute('href', expect.stringMatching(/^https:\/\/njump\.me\/npub1a6c3j/));
    expect(screen.getByText('Talk TBA')).toBeInTheDocument();
    // Branded initials fallback renders until a profile picture loads.
    expect(screen.getByLabelText('Open Mike')).toHaveTextContent('OM');
  });

  it('renders a speaker without a pubkey using the branded fallback', () => {
    const speaker: Speaker = { id: 'test', name: 'Test Speaker', status: 'confirmed', talkTitle: 'A Talk' };
    render(
      <TestApp>
        <FeaturedSpeakerCard speaker={speaker} detailed />
      </TestApp>,
    );

    expect(screen.getByText('Test Speaker')).toBeInTheDocument();
    expect(screen.getByText('A Talk')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Speaker')).toHaveTextContent('TS');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a panel topic and participants once announced', () => {
    render(
      <TestApp>
        <PanelCard
          panel={{
            ...PANEL_2026,
            topic: 'Building on Nostr.',
            participants: [SPEAKERS_2026[0], SPEAKERS_2026[1]],
          }}
        />
      </TestApp>,
    );
    expect(screen.getByText(/Building on Nostr\. With Arkinox, Fundamentals\./)).toBeInTheDocument();
  });
});

describe('ScheduleNote', () => {
  it('says the full schedule is coming soon while it is not finalized', () => {
    render(<ScheduleNote />);
    expect(screen.getByText('Full schedule coming soon.')).toBeInTheDocument();
  });
});
