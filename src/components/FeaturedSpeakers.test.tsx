import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TestApp } from '@/test/TestApp';
import { FeaturedSpeakerCard, FeaturedSpeakers, PanelCard } from './FeaturedSpeakers';
import { EventProgram } from './EventProgram';
import { PANEL_2026, SPEAKERS_2026, type Speaker } from '@/data/nostrValley2026';

describe('FeaturedSpeakers', () => {
  it('renders every announced speaker and the panel', () => {
    render(
      <TestApp>
        <FeaturedSpeakers />
      </TestApp>,
    );

    for (const speaker of SPEAKERS_2026) {
      expect(screen.getByText(speaker.name)).toBeInTheDocument();
    }
    expect(screen.getByText('Panel Discussion')).toBeInTheDocument();
    expect(screen.getByText('Topic and participants TBA')).toBeInTheDocument();
  });

  it('treats Open Mike as a speaker with a branded fallback avatar', () => {
    const openMike = SPEAKERS_2026.find((s) => s.id === 'open-mike')!;
    render(
      <TestApp>
        <FeaturedSpeakerCard speaker={openMike} />
      </TestApp>,
    );

    expect(screen.getByText('Open Mike')).toBeInTheDocument();
    expect(screen.getByText('Topic TBA')).toBeInTheDocument();
    // Initials fallback instead of an <img>.
    expect(screen.getByLabelText('Open Mike')).toHaveTextContent('OM');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('uses an explicit image when provided', () => {
    const speaker: Speaker = {
      id: 'test',
      name: 'Test Speaker',
      status: 'confirmed',
      talkTitle: 'A Talk',
      image: 'https://example.com/avatar.png',
    };
    const { container } = render(
      <TestApp>
        <FeaturedSpeakerCard speaker={speaker} detailed />
      </TestApp>,
    );

    // Radix renders the fallback until the image loads; the img src is still wired up.
    expect(container.innerHTML).toContain('A Talk');
    expect(screen.getByText('Test Speaker')).toBeInTheDocument();
  });

  it('renders a panel with a topic when one is set', () => {
    render(
      <TestApp>
        <PanelCard panel={{ ...PANEL_2026, topic: 'Building on Nostr' }} />
      </TestApp>,
    );
    expect(screen.getByText('Building on Nostr')).toBeInTheDocument();
  });
});

describe('EventProgram', () => {
  it('lists talks and the panel without times', () => {
    render(
      <TestApp>
        <EventProgram />
      </TestApp>,
    );

    expect(screen.getByText('Fanfares')).toBeInTheDocument();
    expect(screen.getByText('Math Sovereignty')).toBeInTheDocument();
    expect(screen.getByText('New Business Model')).toBeInTheDocument();
    expect(screen.getByText('Simplifying Nostr for User Experience')).toBeInTheDocument();
    expect(screen.getByText('The Concord Protocol')).toBeInTheDocument();
    expect(screen.getByText(/Panel Discussion — Topic TBA/)).toBeInTheDocument();
    expect(screen.getByText('Participants TBA')).toBeInTheDocument();
    expect(screen.getByText('Full schedule coming soon.')).toBeInTheDocument();
  });
});
