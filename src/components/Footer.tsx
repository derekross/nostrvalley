import { Link } from 'react-router-dom';
import { NOSTR_VALLEY_NJUMP } from '@/lib/links';
import { NOSTR_VALLEY_2026 } from '@/data/nostrValley2026';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-16">
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
              An annual Nostr and Bitcoin gathering in Happy Valley, Pennsylvania.
            </p>
            <p className="text-muted-foreground">
              {NOSTR_VALLEY_2026.name}: {NOSTR_VALLEY_2026.dateLabel} at {NOSTR_VALLEY_2026.venue}, {NOSTR_VALLEY_2026.locationLong}.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link to="/schedule" className="block text-muted-foreground hover:text-foreground transition-colors">Events</Link>
              <Link to="/speakers" className="block text-muted-foreground hover:text-foreground transition-colors">Speakers</Link>
              <Link to="/community" className="block text-muted-foreground hover:text-foreground transition-colors">Community</Link>
              <Link to="/live" className="block text-muted-foreground hover:text-foreground transition-colors">Live</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-2 text-sm">
              <a
                href={NOSTR_VALLEY_NJUMP}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Follow on Nostr
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
  );
}
