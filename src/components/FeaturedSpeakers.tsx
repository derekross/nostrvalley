import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, Globe, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpeakerAvatar } from '@/components/SpeakerAvatar';
import { useSpeakerProfile } from '@/hooks/useSpeakerProfile';
import { NOSTR_VALLEY_2026, SCHEDULE_TBD_LABEL, SPEAKERS_2026, type Speaker } from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface SpeakerCardProps {
  speaker: Speaker;
  /** Show bio and links when available (used on the Speakers page). */
  detailed?: boolean;
}

export function FeaturedSpeakerCard({ speaker, detailed }: SpeakerCardProps) {
  const profile = useSpeakerProfile(speaker);

  const nameEl = <h3 className="font-semibold text-lg leading-tight">{profile.name}</h3>;

  return (
    <Card className="h-full border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <CardContent className={cn('p-5 md:p-6 flex flex-col h-full min-w-0', detailed && 'text-center items-center')}>
        <div className={cn('flex gap-4 min-w-0 max-w-full', detailed ? 'flex-col items-center' : 'items-center')}>
          <SpeakerAvatar
            name={profile.name}
            image={profile.image}
            className={detailed ? 'h-20 w-20' : 'h-14 w-14 shrink-0'}
            fallbackClassName={detailed ? 'text-xl' : 'text-base'}
          />
          <div className="min-w-0">
            {profile.nostrProfileUrl && !detailed ? (
              <a
                href={profile.nostrProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                {nameEl}
              </a>
            ) : (
              nameEl
            )}
            {speaker.talkTitle && (
              <p className="mt-1 text-sm leading-snug text-foreground/90">{speaker.talkTitle}</p>
            )}
            {!detailed && profile.nip05 && (
              <p className="mt-1 text-xs text-muted-foreground truncate">{profile.nip05}</p>
            )}
          </div>
        </div>

        {detailed && profile.nip05 && (
          <p className="w-full text-sm text-muted-foreground mt-2 break-all">{profile.nip05}</p>
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

/** Small note shown wherever a schedule would appear until times are announced. */
export function ScheduleNote({ className }: { className?: string }) {
  if (NOSTR_VALLEY_2026.scheduleFinalized) return null;
  return (
    <p className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <Clock className="h-4 w-4 text-primary" />
      {SCHEDULE_TBD_LABEL}. Talks run between {NOSTR_VALLEY_2026.timeLabel}; the order and times will be announced.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
          {SPEAKERS_2026.map((speaker) => (
            <FeaturedSpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>

        <div className="text-center mt-8 space-y-4">
          <ScheduleNote />
          {showViewAll && (
            <div>
              <Button variant="outline" asChild>
                <Link to="/speakers">
                  Meet the {NOSTR_VALLEY_2026.year} speakers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
