import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCreateRSVP, useUserEventRSVP, createCalendarEventCoordinates, type RSVPStatus, type RSVPFreeBusy } from '@/hooks/useEventRSVP';
import { Calendar, Check, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import type { NostrEvent } from '@nostrify/nostrify';

interface RSVPDialogProps {
  calendarEvent?: NostrEvent;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function RSVPDialog({ calendarEvent, trigger, children }: RSVPDialogProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<RSVPStatus>('accepted');
  const [freeBusy, setFreeBusy] = useState<RSVPFreeBusy>('free');
  const [note, setNote] = useState('');

  const createRSVP = useCreateRSVP();

  // Get event coordinates if we have a specific calendar event
  const eventCoordinates = calendarEvent ? createCalendarEventCoordinates(calendarEvent) : undefined;
  const userRSVP = useUserEventRSVP(eventCoordinates || '', user?.pubkey);

  const handleRSVP = async () => {
    if (!calendarEvent) {
      toast({
        title: "No Event Selected",
        description: "Please select a specific event to RSVP to.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRSVP.mutateAsync({
        calendarEventId: calendarEvent.id,
        calendarEventCoordinates: createCalendarEventCoordinates(calendarEvent),
        status,
        freeBusy: status === 'declined' ? undefined : freeBusy,
        note: note.trim() || undefined,
      });

      toast({
        title: "RSVP Sent!",
        description: `You've ${status} the invitation${status === 'accepted' ? ' 🎉' : ''}`,
      });

      setOpen(false);
      setNote(''); // Clear note for next time
    } catch (error) {
      console.error('Failed to send RSVP:', error);
      toast({
        title: "RSVP Failed",
        description: error instanceof Error ? error.message : "Failed to send RSVP. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If user isn't logged in, show login prompt
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Register for Nostr Valley
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in to Register</h3>
            <p className="text-muted-foreground mb-6">
              Connect your Nostr account to RSVP for Nostr Valley events.
            </p>
            <LoginArea className="justify-center" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show general registration dialog if no specific event
  if (!calendarEvent) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Register for Nostr Valley
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Event Details Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              Specific event details are being finalized. Check back soon or follow the community feed for updates!
            </p>
            <Button onClick={() => setOpen(false)} variant="outline">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Get event details
  const eventTitle = calendarEvent.tags.find(tag => tag[0] === 'title')?.[1] || 'Nostr Valley Event';
  const eventStart = calendarEvent.tags.find(tag => tag[0] === 'start')?.[1];
  const eventLocation = calendarEvent.tags.find(tag => tag[0] === 'location')?.[1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            RSVP to {eventTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">{eventTitle}</h4>
            {eventStart && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {calendarEvent.kind === 31922 
                  ? new Date(eventStart).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  : new Date(parseInt(eventStart) * 1000).toLocaleString()
                }
              </div>
            )}
            {eventLocation && (
              <div className="text-sm text-muted-foreground">📍 {eventLocation}</div>
            )}
          </div>

          {/* Show existing RSVP status */}
          {userRSVP.hasRSVPd && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">You've already RSVP'd</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={userRSVP.status === 'accepted' ? 'default' : userRSVP.status === 'declined' ? 'destructive' : 'secondary'}>
                  {userRSVP.status}
                </Badge>
                {userRSVP.freeBusy && (
                  <Badge variant="outline">{userRSVP.freeBusy}</Badge>
                )}
              </div>
              {userRSVP.note && (
                <p className="text-sm text-muted-foreground mt-2">"{userRSVP.note}"</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                You can update your RSVP below.
              </p>
            </div>
          )}

          {/* RSVP Form */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Attendance Status</Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as RSVPStatus)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accepted" id="accepted" />
                  <Label htmlFor="accepted">✅ I'll be there!</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tentative" id="tentative" />
                  <Label htmlFor="tentative">🤔 Maybe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="declined" id="declined" />
                  <Label htmlFor="declined">❌ Can't make it</Label>
                </div>
              </RadioGroup>
            </div>

            {status !== 'declined' && (
              <div>
                <Label className="text-base font-medium">Availability</Label>
                <RadioGroup value={freeBusy} onValueChange={(value) => setFreeBusy(value as RSVPFreeBusy)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free">Free (available for the full event)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="busy" id="busy" />
                    <Label htmlFor="busy">Busy (partial availability)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div>
              <Label htmlFor="note" className="text-base font-medium">
                Optional Note
              </Label>
              <Textarea
                id="note"
                placeholder="Any additional comments or questions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleRSVP}
              disabled={createRSVP.isPending}
              className="flex-1"
            >
              {createRSVP.isPending ? 'Sending...' : 'Send RSVP'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}