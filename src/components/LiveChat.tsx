import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveChat } from '@/hooks/useLiveChat';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import type { NostrEvent } from '@nostrify/nostrify';
import { NoteContent } from './NoteContent';

interface LiveChatProps {
  eventCoordinate: string;
  className?: string;
}

function ChatMessage({ event }: { event: NostrEvent }) {
  const { data: author } = useAuthor(event.pubkey);
  const displayName = author?.metadata?.name ?? genUserName(event.pubkey);
  const avatar = author?.metadata?.picture;

  // Format timestamp
  const timestamp = new Date(event.created_at * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex gap-3 py-2 px-3 hover:bg-muted/50 rounded-md">
      <Avatar className="h-8 w-8 mt-1 shrink-0">
        <AvatarImage src={avatar} alt={displayName} />
        <AvatarFallback className="text-xs">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-sm truncate">{displayName}</span>
          <span className="text-xs text-muted-foreground shrink-0">{timestamp}</span>
        </div>
        <div className="text-sm break-words overflow-wrap-anywhere">
          <NoteContent event={event} className="[&_a]:break-all" />
        </div>
      </div>
    </div>
  );
}

export function LiveChat({ eventCoordinate, className }: LiveChatProps) {
  const { data: messages, isLoading } = useLiveChat(eventCoordinate);
  const { mutate: publishEvent, isPending } = useNostrPublish();
  const { user } = useCurrentUser();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive (if enabled)
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Check if user is near bottom to enable/disable auto-scroll
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  const handleSend = () => {
    if (!message.trim() || !user) return;

    publishEvent({
      kind: 1311,
      content: message.trim(),
      tags: [
        ['a', eventCoordinate, '', 'root'],
      ],
    });

    setMessage('');
    setAutoScroll(true); // Re-enable auto-scroll when sending
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-5 w-5" />
          <span>Live Chat</span>
          {!isLoading && messages && (
            <span className="text-sm font-normal text-muted-foreground">
              {messages.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {/* Messages Area */}
      <CardContent
        ref={messagesContainerRef}
        className="flex-1 p-0 overflow-y-auto max-h-[500px] min-h-[300px]"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="py-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} event={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div>
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm font-medium mb-1">No messages yet</p>
              <p className="text-xs text-muted-foreground">
                {user ? 'Be the first to send a message!' : 'Login to join the chat'}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Input Area */}
      {user ? (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="resize-none text-sm min-h-[40px] max-h-[120px]"
              rows={1}
              disabled={isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isPending}
              size="sm"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      ) : (
        <div className="p-4 border-t text-center text-sm text-muted-foreground">
          Login to join the chat
        </div>
      )}
    </Card>
  );
}
