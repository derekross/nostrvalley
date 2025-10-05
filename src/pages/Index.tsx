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
    title: 'Nostr Valley 2.0 - October 18, 2025',
    description: 'Join us at Happy Valley Brewing Company for Nostr Valley 2.0! A full day of talks, panels, food, music, and connection in the heart of Pennsylvania.',
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
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-6 leading-relaxed">
              The future of decentralized social is happening in Happy Valley—and you're invited.
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join us at Happy Valley Brewing Company for a full day of talks, panels, food, music, and connection at the second edition of Nostr Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8 text-white/90">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">October 18, 2025</span>
              </div>
              <div className="hidden sm:block text-white/60">•</div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">Happy Valley Brewing Company, PA</span>
              </div>
            </div>
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
            <h2 className="text-3xl font-bold mb-6">About Nostr Valley</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              This year we're going bigger, deeper, and more fun than ever before. Nostr Valley 2.0 brings together developers, builders, Bitcoiners, creators, and freedom tech enthusiasts to explore the culture, community, and possibilities of Nostr—the open protocol powering the next wave of censorship-resistant communication and social media.
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Whether you're here to learn, network, or simply vibe with like-minded people, you'll find something for you. Come for the ideas, stay for the people, and leave inspired.
            </p>
          </div>
        </section>

      </div>

      {/* What to Expect Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">What to Expect</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A full day packed with insights, connections, and good vibes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inspiring Talks</h3>
              <p className="text-muted-foreground">
                Hear from innovators shaping the decentralized future
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Engaging Panels</h3>
              <p className="text-muted-foreground">
                Deep dives on Nostr, Bitcoin, and digital freedom
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Great Food & Drinks</h3>
              <p className="text-muted-foreground">
                Craft beer and delicious food at Happy Valley Brewing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Music & Community</h3>
              <p className="text-muted-foreground">
                Connect with a welcoming community passionate about building a better internet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss the Premier Nostr Event</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Mark your calendars, bring your friends, and get ready to be part of the movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RSVPDialog calendarEvent={mainConferenceEvent}>
              <Button size="lg" variant="secondary" className="font-semibold px-8">
                <ExternalLink className="h-5 w-5 mr-2" />
                Register Now
              </Button>
            </RSVPDialog>
            <Link to="/schedule">
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary backdrop-blur-sm px-8">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">


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
                October 18, 2025 • Happy Valley Brewing Company, Pennsylvania
              </p>
              <p className="text-muted-foreground mb-4">
                Join us for the second edition of Nostr Valley to celebrate community and culture while shaping the decentralized future.
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
