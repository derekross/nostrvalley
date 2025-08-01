import { useMemo } from 'react';
import { type NostrEvent } from '@nostrify/nostrify';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { cn } from '@/lib/utils';
import { EventPreview } from './EventPreview';

interface NoteContentProps {
  event: NostrEvent;
  className?: string;
  hiddenUrls?: string[]; // URLs that are already displayed as media
}

/** Parses content of text note events so that URLs and hashtags are linkified. */
export function NoteContent({
  event, 
  className,
  hiddenUrls = [],
}: NoteContentProps) {  
  // Process the content to render mentions, links, etc.
  const content = useMemo(() => {
    let text = event.content;
    
    // Remove URLs that are already displayed as media
    if (hiddenUrls.length > 0) {
      hiddenUrls.forEach(url => {
        text = text.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      });
      // Clean up extra whitespace
      text = text.replace(/\s+/g, ' ').trim();
    }
    
    // Get tagged users from p tags for potential replacements
    const taggedUsers = new Map<string, string>();
    event.tags
      .filter(tag => tag[0] === 'p' && tag[1])
      .forEach(tag => {
        const pubkey = tag[1];
        // If there's a petname in the tag, use it as a hint
        const petname = tag[3];
        if (petname) {
          taggedUsers.set(pubkey, petname);
        }
      });
    
    // Regex to find URLs, Nostr references, hashtags, and @ mentions
    const regex = /(https?:\/\/[^\s]+)|(?:nostr:)?(npub1|note1|nprofile1|nevent1|naddr1)([023456789acdefghjklmnpqrstuvwxyz]+)|(#\w+)|(@[a-zA-Z0-9_]+)/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyCounter = 0;
    
    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, url, nostrPrefix, nostrData, hashtag, atMention] = match;
      const index = match.index;
      
      // Add text before this match
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }
      
      if (url) {
        // Handle URLs
        parts.push(
          <a 
            key={`url-${keyCounter++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url}
          </a>
        );
      } else if (nostrPrefix && nostrData) {
        // Handle Nostr references
        try {
          const nostrId = `${nostrPrefix}${nostrData}`;
          const decoded = nip19.decode(nostrId);
          
          if (decoded.type === 'npub') {
            const pubkey = decoded.data;
            const petname = taggedUsers.get(pubkey);
            parts.push(
              <NostrMention key={`mention-${keyCounter++}`} pubkey={pubkey} petname={petname} />
            );
          } else if (decoded.type === 'nprofile') {
            const pubkey = decoded.data.pubkey;
            const petname = taggedUsers.get(pubkey);
            parts.push(
              <NostrMention key={`mention-${keyCounter++}`} pubkey={pubkey} petname={petname} />
            );
          } else if (decoded.type === 'nevent') {
            // Render nevent as an embedded preview
            parts.push(
              <EventPreview key={`event-${keyCounter++}`} neventId={nostrId} className="my-3" />
            );
          } else {
            // For other types, just show as a link
            parts.push(
              <Link 
                key={`nostr-${keyCounter++}`}
                to={`/${nostrId}`}
                className="text-blue-500 hover:underline"
              >
                {fullMatch}
              </Link>
            );
          }
        } catch {
          // If decoding fails, just render as text
          parts.push(fullMatch);
        }
      } else if (hashtag) {
        // Handle hashtags
        const tag = hashtag.slice(1); // Remove the #
        parts.push(
          <Link 
            key={`hashtag-${keyCounter++}`}
            to={`/t/${tag}`}
            className="text-blue-500 hover:underline"
          >
            {hashtag}
          </Link>
        );
      } else if (atMention) {
        // Handle @ mentions - try to match with tagged users
        const mentionName = atMention.slice(1); // Remove the @
        const matchingPubkey = Array.from(taggedUsers.entries())
          .find(([, petname]) => petname?.toLowerCase() === mentionName.toLowerCase())?.[0];
        
        if (matchingPubkey) {
          parts.push(
            <NostrMention key={`mention-${keyCounter++}`} pubkey={matchingPubkey} petname={mentionName} />
          );
        } else {
          // If no match found, render as regular text (might be a non-Nostr mention)
          parts.push(
            <span key={`text-mention-${keyCounter++}`} className="text-muted-foreground">
              {atMention}
            </span>
          );
        }
      }
      
      lastIndex = index + fullMatch.length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If no special content was found, just use the plain text
    if (parts.length === 0) {
      parts.push(text);
    }
    
    return parts;
  }, [event.content, event.tags, hiddenUrls]);

  return (
    <div className={cn("whitespace-pre-wrap break-words", className)}>
      {content.length > 0 ? content : event.content}
    </div>
  );
}

// Helper component to display user mentions
function NostrMention({ pubkey, petname }: { pubkey: string; petname?: string }) {
  const author = useAuthor(pubkey);
  const npub = nip19.npubEncode(pubkey);
  const hasRealName = !!author.data?.metadata?.name;
  
  // Use display name priority: 1) Profile name, 2) Petname from tag, 3) Generated name
  const displayName = author.data?.metadata?.name ?? petname ?? genUserName(pubkey);

  return (
    <a 
      href={`https://njump.me/${npub}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium hover:underline",
        hasRealName 
          ? "text-purple-600 hover:text-purple-700" 
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      @{displayName}
    </a>
  );
}