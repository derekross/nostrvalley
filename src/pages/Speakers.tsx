import { useSeoMeta } from '@unhead/react';
import { Users, Globe, ExternalLink, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Layout } from '@/components/Layout';
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog';
import { FeaturedSpeakerCard, PanelCard, ScheduleNote } from '@/components/FeaturedSpeakers';
import { useNostrValleyEvents, parseCalendarEvent } from '@/hooks/useCalendarEvents';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { NOSTR_VALLEY_2026, PANEL_2026, SPEAKERS_2026 } from '@/data/nostrValley2026';
import { nip19 } from 'nostr-tools';

function CommunityMemberCard({ pubkey, role }: { pubkey: string; role?: string }) {
  const author = useAuthor(pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(pubkey);
  const authorImage = author.data?.metadata?.picture;
  const authorAbout = author.data?.metadata?.about;
  const authorWebsite = author.data?.metadata?.website;
  const authorNip05 = author.data?.metadata?.nip05;
  const npub = nip19.npubEncode(pubkey);

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary/10">
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback className="text-lg">{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h3 className="font-semibold text-lg mb-1">{authorName}</h3>

          {role && (
            <Badge variant="secondary" className="mb-3">
              {role}
            </Badge>
          )}

          {authorNip05 && (
            <p className="text-sm text-muted-foreground mb-3">
              {authorNip05}
            </p>
          )}

          {authorAbout && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {authorAbout}
            </p>
          )}

          <div className="flex justify-center gap-2">
            {authorWebsite && (
              <Button variant="outline" size="sm" asChild>
                <a href={authorWebsite} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a href={`https://njump.me/${npub}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Profile
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Speakers() {
  const events = useNostrValleyEvents();
  const e = NOSTR_VALLEY_2026;

  useSeoMeta({
    title: `${e.year} Speakers · ${e.name}`,
    description: `Speakers at ${e.name}, ${e.dateLabel} in ${e.locationLong}: ${SPEAKERS_2026.map((s) => s.name).join(', ')}, plus a panel discussion.`,
  });

  // People tagged as participants on Nostr Valley calendar events (past and present).
  const participants = new Map<string, { role: string; eventTitles: string[] }>();

  events.data?.forEach(event => {
    const parsedEvent = parseCalendarEvent(event);
    parsedEvent.participants.forEach(participant => {
      const key = participant.pubkey;
      const role = participant.role || 'Speaker';
      const existing = participants.get(key);

      if (existing) {
        existing.eventTitles.push(parsedEvent.title);
        if (role !== 'Speaker' && existing.role === 'Speaker') {
          existing.role = role;
        }
      } else {
        participants.set(key, {
          role,
          eventTitles: [parsedEvent.title]
        });
      }
    });
  });

  const participantList = Array.from(participants.entries()).map(([pubkey, data]) => ({
    pubkey,
    ...data
  }));

  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 hero-gradient opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
            <Mic className="h-3.5 w-3.5 mr-1.5" />
            {e.name}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{e.year} Speakers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The lineup for {e.name} on {e.dateLabel} at {e.venue}, {e.locationLong}.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* 2026 lineup */}
        <section aria-labelledby="lineup-heading">
          <h2 id="lineup-heading" className="sr-only">Announced speakers</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {SPEAKERS_2026.map((speaker) => (
                <FeaturedSpeakerCard key={speaker.id} speaker={speaker} detailed />
              ))}
            </div>
            <PanelCard panel={PANEL_2026} className="mt-4 md:mt-5" />
            <div className="text-center mt-6">
              <ScheduleNote />
            </div>
          </div>
        </section>

        {/* Propose a talk */}
        <section className="mt-14 max-w-2xl mx-auto">
          <Card className="border-dashed">
            <CardContent className="p-6 md:p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Want to present at Nostr Valley?</h2>
              <p className="text-sm text-muted-foreground mb-5">
                We're always looking for people to share what they're building or learning. All levels welcome.
              </p>
              <SubmitProposalDialog />
            </CardContent>
          </Card>
        </section>

        {/* People from Nostr calendar events */}
        {(events.isLoading || participantList.length > 0) && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Past Presenters &amp; Organizers
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                People tagged on Nostr Valley calendar events published to Nostr.
              </p>
            </div>

            {events.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 text-center">
                      <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4" />
                      <div className="h-5 bg-muted rounded w-32 mx-auto mb-2" />
                      <div className="h-4 bg-muted rounded w-20 mx-auto mb-4" />
                      <div className="h-3 bg-muted rounded w-full mb-2" />
                      <div className="h-3 bg-muted rounded w-3/4 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participantList.map(({ pubkey, role }) => (
                    <CommunityMemberCard key={pubkey} pubkey={pubkey} role={role} />
                  ))}
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 text-center">Sessions on Nostr</h3>
                  <div className="grid gap-4 max-w-2xl mx-auto">
                    {Array.from(new Set(participantList.flatMap(s => s.eventTitles))).slice(0, 5).map((title, i) => (
                      <Card key={i} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{title}</h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}
