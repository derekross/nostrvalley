import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, Globe, MessageSquare, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpeakerAvatar } from '@/components/SpeakerAvatar';
import { useSpeakerProfile } from '@/hooks/useSpeakerProfile';
import {
  NOSTR_VALLEY_2026,
  PANEL_2026,
  SCHEDULE_TBA_LABEL,
  SPEAKERS_2026,
  type PanelSession,
  type Speaker,
} from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface SpeakerCardProps {
  speaker: Speaker;
  /** Show NIP-05, bio, and links when available (used on the Speakers page). */
  detailed?: boolean;
}

/**
 * Speaker card. The compact (homepage) variant shows only avatar, name, and
 * talk title so the whole lineup scans quickly; the detailed variant adds
 * profile information pulled from Nostr.
 */
export function FeaturedSpeakerCard({ speaker, detailed }: SpeakerCardProps) {
  const profile = useSpeakerProfile(speaker);

  const name = <h3 className="font-semibold text-base md:text-lg leading-tight">{profile.name}</h3>;

  return (
    <Card className="h-full border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 md:p-5 flex flex-col items-center text-center h-full min-w-0">
        <SpeakerAvatar
          name={profile.name}
          image={profile.image}
          className={cn('mb-3', detailed ? 'h-20 w-20' : 'h-16 w-16 md:h-20 md:w-20')}
          fallbackClassName="text-xl"
        />
        {profile.nostrProfileUrl && !detailed ? (
          <a
            href={profile.nostrProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            {name}
          </a>
        ) : (
          name
        )}
        {speaker.talkTitle && (
          <p className="mt-1 text-sm leading-snug w-full break-words [overflow-wrap:anywhere] text-foreground/90">
            {speaker.talkTitle}
          </p>
        )}

        {detailed && profile.nip05 && (
          <p className="w-full text-xs text-muted-foreground mt-2 break-all">{profile.nip05}</p>
        )}

        {detailed && profile.bio && (
          <p className="w-full text-sm text-muted-foreground mt-3 line-clamp-4 break-words [overflow-wrap:anywhere]">
            {profile.bio}
          </p>
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
                  Profile
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** The panel discussion, visually distinct from the individual talk cards. */
export function PanelCard({ panel, className }: { panel: PanelSession; className?: string }) {
  const participants = panel.participants?.map((p) => p.name).join(', ');
  return (
    <Card className={cn('border-dashed border-primary/30 bg-primary/5 shadow-none', className)}>
      <CardContent className="p-4 md:p-5 flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 text-left">
          <h3 className="font-semibold text-base md:text-lg leading-tight uppercase tracking-wide">{panel.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {panel.topic ?? 'Topic & participants coming soon.'}
            {panel.topic && participants ? ` With ${participants}.` : null}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/** Small note shown wherever a schedule would appear until times are announced. */
export function ScheduleNote({ className }: { className?: string }) {
  if (NOSTR_VALLEY_2026.scheduleFinalized) return null;
  return (
    <p className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <Clock className="h-4 w-4 text-primary" />
      {SCHEDULE_TBA_LABEL}
    </p>
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
    <section id="speakers" className={cn('py-14 md:py-20 scroll-mt-16', className)}>
      <div className="container mx-auto px-4">
        {showHeading && (
          <div className="text-center mb-8 md:mb-10">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
              <Mic className="h-3.5 w-3.5 mr-1.5" />
              {NOSTR_VALLEY_2026.year} Lineup
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase mb-3">Featured Speakers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Builders, thinkers, and creators from across the Nostr ecosystem.
            </p>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {SPEAKERS_2026.map((speaker) => (
              <FeaturedSpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>

          <PanelCard panel={PANEL_2026} className="mt-4 md:mt-5" />

          <div className="text-center mt-8 space-y-4">
            <ScheduleNote />
            {showViewAll && (
              <div>
                <Button variant="outline" asChild>
                  <Link to="/speakers">
                    Speaker profiles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
