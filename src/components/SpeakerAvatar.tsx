import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { speakerInitials } from '@/data/nostrValley2026';
import { cn } from '@/lib/utils';

interface SpeakerAvatarProps {
  name: string;
  image?: string;
  className?: string;
  /** Tailwind text size class for the fallback initials. */
  fallbackClassName?: string;
}

/**
 * Avatar with a branded fallback: when no image is available, the speaker's
 * initials are rendered on the Nostr Valley gradient instead of a broken or
 * generic placeholder image.
 */
export function SpeakerAvatar({ name, image, className, fallbackClassName }: SpeakerAvatarProps) {
  return (
    <Avatar className={cn('ring-2 ring-primary/20', className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback
        className={cn('gradient-bg text-white font-bold tracking-wide select-none', fallbackClassName)}
        aria-label={name}
      >
        {speakerInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
