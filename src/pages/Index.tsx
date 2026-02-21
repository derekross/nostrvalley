import { useSeoMeta } from '@unhead/react';
import { Calendar, Users, Camera, Hash, MapPin, Repeat, ArrowRight, ExternalLink, Sparkles, Video, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { RSVPDialog } from '@/components/RSVPDialog';
import { useNostrValleyMedia } from '@/hooks/useNostrValleyFeed';
import { useNostrValleyEvents, parseCalendarEvent } from '@/hooks/useCalendarEvents';
import { Link } from 'react-router-dom';

const MEETUP_URL = 'https://www.meetup.com/nostr-valley-bitcoin-decentralized-social-meetup';

const Index = () => {
  const media = useNostrValleyMedia();
  const events = useNostrValleyEvents();

  useSeoMeta({
    title: 'Nostr Valley - Nostr & Bitcoin Meetup in Happy Valley, PA',
    description: 'Nostr Valley is a monthly Nostr and Bitcoin meetup in Happy Valley, Pennsylvania. Join us to learn, connect, and grow the local freedom tech community.',
  });

  // Get the next upcoming event
  const nextEvent = events.data?.find(event => {
    const parsed = parseCalendarEvent(event);
    return parsed.kind === 31922
      ? new Date(parsed.start) >= new Date()
      : parseInt(parsed.start) * 1000 >= Date.now();
  });

  const nextEventParsed = nextEvent ? parseCalendarEvent(nextEvent) : null;

  const formatEventDate = (start: string, kind: number) => {
    if (kind === 31922) {
      return new Date(start).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const date = new Date(parseInt(start) * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatEventTime = (start: string, kind: number) => {
    if (kind === 31923) {
      const date = new Date(parseInt(start) * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return null;
  };

  return (
    <Layout hideFooter>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        {/* Radial glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/nv-logo.png"
                alt="Nostr Valley"
                className="w-52 h-52 md:w-72 md:h-72 object-contain rounded-full shadow-2xl ring-4 ring-primary/20"
              />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Nostr Valley
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              A monthly Nostr and Bitcoin meetup in Happy Valley, Pennsylvania. Whether you're deep in the protocol or just curious, pull up a chair.
            </p>

            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm font-medium shadow-sm">
                <Repeat className="h-4 w-4 text-primary" />
                Monthly Meetups
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm font-medium shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Happy Valley, PA
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <RSVPDialog calendarEvent={nextEvent}>
                <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/25">
                  RSVP with Nostr
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </RSVPDialog>
              <Link to="/schedule">
                <Button variant="outline" size="lg" className="px-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Event Section */}
      {nextEventParsed ? (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Next Event
                </Badge>
              </div>
              <Card className="overflow-hidden border-primary/20 shadow-lg">
                <CardContent className="p-0">
                  <div className="gradient-bg p-6 md:p-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{nextEventParsed.title}</h2>
                    {nextEventParsed.summary && (
                      <p className="text-white/80 text-base">{nextEventParsed.summary}</p>
                    )}
                  </div>
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {formatEventDate(nextEventParsed.start, nextEventParsed.kind)}
                      </div>
                      {formatEventTime(nextEventParsed.start, nextEventParsed.kind) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-primary font-medium">
                            {formatEventTime(nextEventParsed.start, nextEventParsed.kind)}
                          </span>
                        </div>
                      )}
                      {nextEventParsed.location.length > 0 && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {nextEventParsed.location[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <RSVPDialog calendarEvent={nextEvent}>
                        <Button className="flex-1 sm:flex-none">
                          RSVP with Nostr
                        </Button>
                      </RSVPDialog>
                      <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                        <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Register on Meetup
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Stay Tuned
              </Badge>
              <h2 className="text-2xl font-bold mb-3">Next meetup date coming soon</h2>
              <p className="text-muted-foreground mb-6">
                Join our Meetup group to get notified when the next event is announced.
              </p>
              <Button asChild>
                <a href={MEETUP_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join on Meetup
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About Section - Two Columns */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Nostr Valley</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nostr Valley started as a one-day conference and grew into something bigger: a local community. We meet monthly to talk about Nostr, Bitcoin, freedom tech, and the ideas shaping a more open internet.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Once a year, we host a larger event that brings the wider ecosystem to Happy Valley. But the real value is in the regular gatherings -- no gatekeeping, no jargon walls. Just good conversations, real demos, and a community that's building together.
              </p>
              <Button variant="outline" asChild>
                <Link to="/community">
                  <Hash className="h-4 w-4 mr-2" />
                  View Community Feed
                </Link>
              </Button>
            </div>

            {/* Community Photos */}
            <div className="grid grid-cols-2 gap-3">
              {media.data && media.data.length > 0 ? (
                media.data.slice(0, 4).map((event, i) => {
                  const imageMatch = event.content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
                  const imageUrl = imageMatch ? imageMatch[0] : null;

                  return imageUrl ? (
                    <div key={event.id || i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt="Community photo from #NostrValley"
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
                    <p className="text-sm text-muted-foreground">Community photos coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 md:py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Monthly gatherings plus a bigger annual event to bring it all together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Repeat className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Monthly Meetups</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Casual monthly gatherings with demos, discussions, and beginner onboarding. Learn about Nostr, Bitcoin, and freedom tech from your neighbors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Annual Event</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A larger gathering once a year with talks, panels, and visitors from across the Nostr and Bitcoin ecosystem. Our flagship event.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Open to Everyone</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bitcoiners, developers, creators, students, or just curious newcomers. You don't need to be an expert -- just show up.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Archive Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">See What We're About</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Watch recordings from past Nostr Valley meetups and events
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/videoseries?list=PLTQJ1TiXFu42cVsvpJ2jwKetZ6kzA-YYx"
                    title="Nostr Valley Event Archive"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Past talks, panels, and demos from Nostr Valley
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="https://www.youtube.com/playlist?list=PLTQJ1TiXFu42cVsvpJ2jwKetZ6kzA-YYx"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Full Playlist
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-12 md:py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Our Sponsors</h2>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Thank you to the people and projects that support Nostr Valley and help make our meetups possible.
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
              Interested in sponsoring Nostr Valley?{' '}
              <a
                href="https://njump.me/npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny"
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

      {/* Join the Community CTA */}
      <section className="py-16 md:py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Come Build With Us</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            New to Nostr? Curious about Bitcoin? You don't need to be an expert. Just show up -- that's how every community starts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <RSVPDialog calendarEvent={nextEvent}>
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
              href="https://njump.me/npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny"
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
            <Link to="/speakers" className="hover:text-white transition-colors">
              Meet the People
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (from Layout is hidden, we render our own here after the gradient CTA) */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/nv-logo.png"
                  alt="Nostr Valley"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">Nostr Valley</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                A monthly Nostr and Bitcoin meetup in Happy Valley, Pennsylvania.
              </p>
              <p className="text-muted-foreground">
                Growing the local community and connecting people to the wider freedom tech ecosystem.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <div className="space-y-2 text-sm">
                <Link to="/schedule" className="block text-muted-foreground hover:text-foreground transition-colors">Events</Link>
                <Link to="/speakers" className="block text-muted-foreground hover:text-foreground transition-colors">People</Link>
                <Link to="/community" className="block text-muted-foreground hover:text-foreground transition-colors">Community</Link>
                <Link to="/live" className="block text-muted-foreground hover:text-foreground transition-colors">Live</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://njump.me/npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Follow on Nostr
                </a>
                <a
                  href={MEETUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join on Meetup
                </a>
                <a
                  href="https://grownostr.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Grow Nostr
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-8 text-center text-sm text-muted-foreground">
            <p>Powered by Nostr</p>
            <p className="mt-2">
              <a
                href="https://shakespeare.diy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vibed with Shakespeare
              </a>
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
