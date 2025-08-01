import { useSeoMeta } from '@unhead/react';
import { Users, Globe, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navigation } from '@/components/Navigation';
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog';
import { useNostrValleyEvents, parseCalendarEvent } from '@/hooks/useCalendarEvents';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';

function SpeakerCard({ pubkey, role }: { pubkey: string; role?: string }) {
  const author = useAuthor(pubkey);
  const authorName = author.data?.metadata?.name ?? genUserName(pubkey);
  const authorImage = author.data?.metadata?.picture;
  const authorAbout = author.data?.metadata?.about;
  const authorWebsite = author.data?.metadata?.website;
  const authorNip05 = author.data?.metadata?.nip05;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
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
            <Button variant="outline" size="sm">
              <Zap className="h-3 w-3 mr-1" />
              Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Speakers() {
  const events = useNostrValleyEvents();

  useSeoMeta({
    title: 'Speakers - Nostr Valley',
    description: 'Meet the speakers and presenters at Nostr Valley conference. Learn from leading experts in the Nostr ecosystem.',
  });

  // Extract speakers from event participants
  const speakers = new Map<string, { role: string; eventTitles: string[] }>();
  
  events.data?.forEach(event => {
    const parsedEvent = parseCalendarEvent(event);
    parsedEvent.participants.forEach(participant => {
      const key = participant.pubkey;
      const role = participant.role || 'Speaker';
      const existing = speakers.get(key);
      
      if (existing) {
        existing.eventTitles.push(parsedEvent.title);
        // Keep the most specific role
        if (role !== 'Speaker' && existing.role === 'Speaker') {
          existing.role = role;
        }
      } else {
        speakers.set(key, {
          role,
          eventTitles: [parsedEvent.title]
        });
      }
    });
  });

  const speakerList = Array.from(speakers.entries()).map(([pubkey, data]) => ({
    pubkey,
    ...data
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Conference Speakers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the experts, builders, and thought leaders presenting at Nostr Valley
          </p>
        </div>

        {events.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : speakerList.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                {speakerList.length} Speaker{speakerList.length !== 1 ? 's' : ''} Confirmed
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakerList.map(({ pubkey, role }) => (
                <SpeakerCard key={pubkey} pubkey={pubkey} role={role} />
              ))}
            </div>
            
            {/* Featured Sessions */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Featured Sessions</h2>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {Array.from(new Set(speakerList.flatMap(s => s.eventTitles))).slice(0, 5).map((title, i) => (
                  <Card key={i} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h3 className="font-medium">{title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-16 px-8 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-lg font-semibold mb-2">Speakers Coming Soon</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're confirming an amazing lineup of speakers from across the Nostr ecosystem.
              </p>
              <div className="bg-muted rounded-lg p-6 max-w-lg mx-auto">
                <h4 className="font-medium mb-2">Want to speak at Nostr Valley?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  We're looking for builders, researchers, and innovators to share their insights.
                </p>
                <SubmitProposalDialog />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}