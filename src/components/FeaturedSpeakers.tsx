import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Globe, MessageSquare, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpeakerAvatar } from '@/components/SpeakerAvatar';
import { useSpeakerProfile } from '@/hooks/useSpeakerProfile';
import {
  NOSTR_VALLEY_2026,
  PANEL_2026,
  SPEAKERS_2026,
  TOPIC_TBA_LABEL,
  type PanelSession,
  type Speaker,
} from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface SpeakerCardProps {
  speaker: Speaker;
  /** Show bio and links when available (used on the Speakers page). */
  detailed?: boolean;
}

export function FeaturedSpeakerCard({ speaker, detailed }: SpeakerCardProps) {
  const profile = useSpeakerProfile(speaker);
  const hasTopic = Boolean(speaker.talkTitle);

  return (
    <Card className="h-full border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <CardContent className={cn('p-5 md:p-6 flex flex-col h-full', detailed ? 'text-center' : '')}>
        <div className={cn('flex gap-4', detailed ? 'flex-col items-center' : 'items-center')}>
          <SpeakerAvatar
            name={profile.name}
            image={profile.image}
            className={detailed ? 'h-20 w-20' : 'h-14 w-14 shrink-0'}
            fallbackClassName={detailed ? 'text-xl' : 'text-base'}
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-lg leading-tight">{profile.name}</h3>
            <p
              className={cn(
                'mt-1 text-sm leading-snug',
                hasTopic ? 'text-foreground/90' : 'text-muted-foreground italic',
              )}
            >
              {hasTopic ? speaker.talkTitle : TOPIC_TBA_LABEL}
            </p>
          </div>
        </div>

        {detailed && profile.bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-4">{profile.bio}</p>
        )}

        {detailed && (profile.links.length > 0 || profile.nostrProfileUrl) && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {profile.links.map((link) => (
              <Button key={link.url} variant="outline" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3 w-3 mr-1" />
                  {link.label}
                </a>
              </Button>
            ))}
            {profile.nostrProfileUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.nostrProfileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Nostr profile
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PanelCard({ panel, className }: { panel: PanelSession; className?: string }) {
  return (
    <Card className={cn('border-dashed border-primary/30 bg-primary/5', className)}>
      <CardContent className="p-5 md:p-6 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-lg leading-tight">{panel.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {panel.topic ?? 'Topic and participants TBA'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeaturedSpeakersProps {
  /** Render the section heading. Defaults to true. */
  showHeading?: boolean;
  /** Link to the full speakers page. */
  showViewAll?: boolean;
  className?: string;
}

export function FeaturedSpeakers({ showHeading = true, showViewAll = true, className }: FeaturedSpeakersProps) {
  return (
    <section id="speakers" className={cn('py-14 md:py-20', className)}>
      <div className="container mx-auto px-4">
        {showHeading && (
          <div className="text-center mb-10 md:mb-12">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
              <Mic className="h-3.5 w-3.5 mr-1.5" />
              {NOSTR_VALLEY_2026.year} Speakers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Featured Speakers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Builders and creators from across the Nostr and Bitcoin ecosystem, on stage in Happy Valley.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {SPEAKERS_2026.map((speaker) => (
            <FeaturedSpeakerCard key={speaker.id} speaker={speaker} />
          ))}
          <PanelCard panel={PANEL_2026} className="sm:col-span-2 lg:col-span-1" />
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/speakers">
                Meet the {NOSTR_VALLEY_2026.year} speakers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
