import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';

interface ParticipantItemProps {
  pubkey: string;
  role?: string;
}

export function ParticipantItem({ pubkey, role }: ParticipantItemProps) {
  const { data: author } = useAuthor(pubkey);
  const displayName = author?.metadata?.name ?? genUserName(pubkey);
  const avatar = author?.metadata?.picture;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={displayName} />
          <AvatarFallback className="text-xs">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{displayName}</p>
          {role && (
            <Badge variant="outline" className="text-xs mt-1">
              {role}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
