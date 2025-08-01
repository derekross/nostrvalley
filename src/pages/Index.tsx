import { useSeoMeta } from '@unhead/react';
import { Calendar, Users, Camera, ExternalLink, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { RSVPDialog } from '@/components/RSVPDialog';
import { useNostrValleyMedia } from '@/hooks/useNostrValleyFeed';
import { useNostrValleyEvents } from '@/hooks/useCalendarEvents';
import { Link } from 'react-router-dom';

const Index = () => {
  const media = useNostrValleyMedia();
  const events = useNostrValleyEvents();

  useSeoMeta({
    title: 'Nostr Valley - The Premier Nostr Conference',
    description: 'Join us at Nostr Valley, the premier conference for the Nostr protocol community. Learn, network, and build the decentralized future.',
  });

  // Get the main conference event for registration (any available event)
  const mainConferenceEvent = events.data?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Background */}
      <section className="relative overflow-hidden">
        {/* Hero Background - Image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gradient-to-br from-purple-600 to-blue-600"
          style={{ backgroundImage: 'url(/NV-Hero.png)' }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <br />
              <span className="bg-white text-transparent bg-clip-text">Nostr Valley</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              The premier conference in Happy Valley bringing together developers, builders, and enthusiasts
              of the Nostr protocol. Join us to celebrate community and culture while shaping the decentralized future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <RSVPDialog calendarEvent={mainConferenceEvent}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Register Now
                </Button>
              </RSVPDialog>
              <Link to="/schedule">
                <Button variant="outline" size="lg" className="border-white/80 text-white bg-white/10 hover:bg-white hover:text-black backdrop-blur-sm px-8">
                  <Calendar className="h-5 w-5 mr-2" />
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* About Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Nostr Valley</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're back in the heart of Happy Valley for the second edition of Nostr Valley! Hosted near Penn State University in central Pennsylvania, Nostr Valley 2.0 brings together builders, thinkers, and freedom tech enthusiasts for a grassroots event focused on decentralized social, Bitcoin, and the growing Nostr ecosystem. Expect meetups, mini talks, workshops, and real conversations—right where innovation and independence meet. Whether you're a dev, creator, or just Nostr-curious, this is where the vibes live.
            </p>
          </div>
        </section>


        {/* Community Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Join the Conversation</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The Nostr Valley community is already buzzing with excitement. Follow along with
                real-time updates, photos, and discussions using #NostrValley.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/community">
                  <Button className="w-full sm:w-auto">
                    <Hash className="h-4 w-4 mr-2" />
                    View Community Feed
                  </Button>
                </Link>
                <Link to="/speakers">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Users className="h-4 w-4 mr-2" />
                    Meet the Speakers
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {media.data && media.data.length > 0 ? (
                media.data.slice(0, 4).map((event, i) => {
                  const imageMatch = event.content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
                  const imageUrl = imageMatch ? imageMatch[0] : null;

                  return imageUrl ? (
                    <div key={event.id || i} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Community photo from #NostrValley"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : null;
                }).filter(Boolean)
              ) : (
                <div className="col-span-2 aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Community photos coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/NV-Hero.png"
                  alt="Nostr Valley"
                  className="h-8 w-8 rounded object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">Nostr Valley</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                The premiere Nostr event in Happy Valley.
                Join us to celebrate community and culture while shaping the decentralized future.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Conference</h4>
              <div className="space-y-2 text-sm">
                <Link to="/schedule" className="block text-muted-foreground hover:text-foreground">Schedule</Link>
                <Link to="/speakers" className="block text-muted-foreground hover:text-foreground">Speakers</Link>
                <Link to="/community" className="block text-muted-foreground hover:text-foreground">Community</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://njump.me/npub10hj9rg5gds5x2gk0z0s2jlqnq04jg7g30aj2t5pqzdaaztfactgsnze5ny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground hover:underline"
                >
                  #NostrValley
                </a>
                <a
                  href="https://grownostr.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground hover:underline"
                >
                  Grow Nostr
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-8 text-center text-sm text-muted-foreground">
            <p>Powered by Nostr • Built with ❤️ for the decentralized future</p>
            <p className="mt-2">
              <a
                href="https://soapbox.pub/mkstack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vibed with MKStack
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
