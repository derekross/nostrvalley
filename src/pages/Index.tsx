import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Camera, ExternalLink, Hash, Heart, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import { RSVPDialog } from '@/components/RSVPDialog';
import { EventFacts } from '@/components/EventFacts';
import { FeaturedSpeakers } from '@/components/FeaturedSpeakers';
import { EventProgram } from '@/components/EventProgram';
import { useNostrValleyMedia } from '@/hooks/useNostrValleyFeed';
import { useNostrValleyEvents } from '@/hooks/useCalendarEvents';
import { findEventForDate } from '@/lib/calendarEvents';
import { NOSTR_VALLEY_2026 } from '@/data/nostrValley2026';
import { MEETUP_URL, NOSTR_VALLEY_NJUMP, YOUTUBE_PLAYLIST_EMBED_URL, YOUTUBE_PLAYLIST_URL } from '@/lib/links';

const Index = () => {
  const media = useNostrValleyMedia();
  const events = useNostrValleyEvents();
  const e = NOSTR_VALLEY_2026;

  useSeoMeta({
    title: `${e.name} · ${e.dateLabel} · ${e.locationShort}`,
    description: `${e.subtitle}. ${e.tagline} ${e.dateLabel}, ${e.timeLabel} at ${e.venue} in ${e.locationLong}.`,
  });

  // Prefer the published NIP-52 event for the annual date; fall back to the
  // next upcoming Nostr Valley event so RSVP keeps working either way.
  const rsvpEvent = findEventForDate(events.data, e.date, e.timeZone);

  return (
    <Layout hideFooter>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[640px] h-[640px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <img
              src="/nv-logo.png"
              alt="Nostr Valley"
              className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full shadow-2xl ring-4 ring-primary/20 mb-6"
            />

            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              {e.subtitle}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none mb-6">
              Nostr Valley <span className="gradient-text">III</span>
            </h1>

            <EventFacts className="mb-6" />

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              {e.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              <RSVPDialog calendarEvent={rsvpEvent}>
                <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/25">
                  RSVP with Nostr
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </RSVPDialog>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Register on Meetup.com
                </a>
              </Button>
            </div>

            <a
              href="#speakers"
              className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              See who's speaking &darr;
            </a>
          </div>
        </div>
      </section>

      {/* Featured speakers */}
      <FeaturedSpeakers />

      {/* Program */}
      <EventProgram />

      {/* About */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">About Nostr Valley</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-5">
                Nostr Valley is an annual gathering in Happy Valley, Pennsylvania that brings together
                people building, using, and exploring Nostr, Bitcoin, and the open internet.
                In {e.year}, we're back for our third year.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Bitcoiners, developers, creators, students, and curious newcomers. No gatekeeping, no
                jargon walls. Just talks, demos, a panel, and good conversation at a brewery. You don't
                need to be an expert; just show up.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild>
                  <Link to="/community">
                    <Hash className="h-4 w-4 mr-2" />
                    Community Feed
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a href={NOSTR_VALLEY_NJUMP} target="_blank" rel="noopener noreferrer">
                    Follow on Nostr
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Community photos from #NostrValley */}
            <div className="grid grid-cols-2 gap-3">
              {media.data && media.data.length > 0 ? (
                media.data.slice(0, 4).map((event, i) => {
                  const imageMatch = event.content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
                  const imageUrl = imageMatch ? imageMatch[0] : null;

                  return imageUrl ? (
                    <div key={event.id || i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt="Photo from a past Nostr Valley, shared with #NostrValley"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : null;
                }).filter(Boolean)
              ) : (
                <div className="col-span-2 aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">Photos tagged #NostrValley show up here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Past Nostr Valleys */}
      <section id="past-events" className="py-14 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Past Nostr Valleys</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Talks, panels, and demos from the first two annual events.
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={YOUTUBE_PLAYLIST_EMBED_URL}
                    title="Nostr Valley recordings"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Recordings from previous Nostr Valley events
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={YOUTUBE_PLAYLIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Full Playlist
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/schedule">
                        <Calendar className="h-4 w-4 mr-2" />
                        Previous events
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Our Sponsors</h2>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Thank you to the people and projects that support Nostr Valley and help make the annual event possible.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 max-w-3xl mx-auto">
            <a
              href="https://soapbox.pub"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl hover:bg-card hover:shadow-md transition-all duration-300"
            >
              <img
                src="/sponsors/soapbox.svg"
                alt="Soapbox"
                className="h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity dark:invert"
              />
            </a>

            <a
              href="https://zap.cooking"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl hover:bg-card hover:shadow-md transition-all duration-300"
            >
              <img
                src="/sponsors/zapcooking.svg"
                alt="Zap Cooking"
                className="h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity invert dark:invert-0"
              />
            </a>
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground">
              Interested in sponsoring {e.name}?{' '}
              <a
                href={NOSTR_VALLEY_NJUMP}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Reach out on Nostr
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
            {e.dateLabel} &middot; {e.locationShort}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See you at {e.name}</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Noon to 4 PM at {e.venue}. New to Nostr? Curious about Bitcoin? Pull up a chair.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <RSVPDialog calendarEvent={rsvpEvent}>
              <Button size="lg" variant="secondary" className="font-semibold px-8">
                RSVP with Nostr
              </Button>
            </RSVPDialog>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8" asChild>
              <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Register on Meetup.com
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center text-sm text-white/60">
            <a
              href={NOSTR_VALLEY_NJUMP}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Follow on Nostr
            </a>
            <span>&bull;</span>
            <Link to="/community" className="hover:text-white transition-colors">
              Community Feed
            </Link>
            <span>&bull;</span>
            <Link to="/speakers" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {e.year} Speakers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default Index;
