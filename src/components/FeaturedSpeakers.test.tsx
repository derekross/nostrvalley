import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestApp } from '@/test/TestApp';
import { FeaturedSpeakerCard, FeaturedSpeakers, ScheduleNote } from './FeaturedSpeakers';
import { SPEAKERS_2026, type Speaker } from '@/data/nostrValley2026';

describe('FeaturedSpeakers', () => {
  it('renders every announced speaker and the schedule note', () => {
    render(
      <TestApp>
        <FeaturedSpeakers />
      </TestApp>,
    );

    for (const speaker of SPEAKERS_2026) {
      expect(screen.getByText(speaker.name)).toBeInTheDocument();
    }
    expect(screen.getByText(/Schedule TBD/)).toBeInTheDocument();
    expect(screen.queryByText(/Topic TBA/)).not.toBeInTheDocument();
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
    // Branded initials fallback renders until a profile picture loads.
    expect(screen.getByLabelText('Open Mike')).toHaveTextContent('OM');
  });

  it('renders a speaker without a pubkey using the branded fallback', () => {
    const speaker: Speaker = { id: 'test', name: 'Test Speaker', status: 'confirmed' };
    render(
      <TestApp>
        <FeaturedSpeakerCard speaker={speaker} detailed />
      </TestApp>,
    );

    expect(screen.getByText('Test Speaker')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Speaker')).toHaveTextContent('TS');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows a talk title only when one is set', () => {
    const speaker: Speaker = { id: 'test', name: 'Test Speaker', status: 'confirmed', talkTitle: 'A Talk' };
    render(
      <TestApp>
        <FeaturedSpeakerCard speaker={speaker} />
      </TestApp>,
    );
    expect(screen.getByText('A Talk')).toBeInTheDocument();
  });
});

describe('ScheduleNote', () => {
  it('says the schedule is TBD while it is not finalized', () => {
    render(<ScheduleNote />);
    expect(screen.getByText(/Schedule TBD/)).toBeInTheDocument();
  });
});
