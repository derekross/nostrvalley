import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDirectMessage } from "@/hooks/useDirectMessage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthor } from "@/hooks/useAuthor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Lock, ExternalLink, User, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginArea } from "@/components/auth/LoginArea";
import { NOSTR_VALLEY_PUBKEY } from "@/hooks/useNostrValley";

interface SubmitProposalDialogProps {
  children?: React.ReactNode;
}

export function SubmitProposalDialog({ children }: SubmitProposalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { user } = useCurrentUser();
  const { sendDirectMessage } = useDirectMessage();
  const organizer = useAuthor(NOSTR_VALLEY_PUBKEY);

  const organizerMetadata = organizer.data?.metadata;
  const organizerName = organizerMetadata?.name || "Nostr Valley Organizers";
  const organizerImage = organizerMetadata?.picture;

  const handleSubmitProposal = async () => {
    if (!title.trim() || !description.trim() || !user) return;

    setIsSending(true);
    try {
      // Create a comprehensive proposal message
      const proposalMessage = `🎤 SPEAKER PROPOSAL FOR NOSTR VALLEY

📋 TALK DETAILS:
Title: ${title}

Description:
${description}

👤 SPEAKER INFO:
${bio ? `Bio: ${bio}` : 'No additional bio provided'}

---
This proposal was submitted via the Nostr Valley website.`;

      await sendDirectMessage(NOSTR_VALLEY_PUBKEY, proposalMessage);
      setTitle("");
      setDescription("");
      setBio("");
      setIsOpen(false);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to send proposal:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isSending) {
      e.preventDefault();
      handleSubmitProposal();
    }
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Submit Proposal
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Submit Speaker Proposal
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in to Submit</h3>
            <p className="text-muted-foreground mb-6">
              Connect your Nostr account to submit a speaker proposal for Nostr Valley.
            </p>
            <LoginArea className="justify-center" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Submit Proposal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Submit Speaker Proposal
            </DialogTitle>
            <DialogDescription>
              Share your idea for a talk, workshop, or presentation at Nostr Valley.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-6 py-4">
            {/* Organizer info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={organizerImage} alt={organizerName} />
                <AvatarFallback>{organizerName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{organizerName}</p>
                <p className="text-xs text-muted-foreground">Conference Organizers</p>
              </div>
            </div>

            {/* Security notice */}
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your proposal will be sent as an encrypted DM using NIP-17 and only visible to
                you and the organizers.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {/* Talk Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Talk Title *</Label>
                <Input
                  id="title"
                  placeholder="What's your talk about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSending}
                  className="w-full"
                />
              </div>

              {/* Talk Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your talk, what you'll cover, who it's for, and why it matters to the Nostr community..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] resize-none"
                  disabled={isSending}
                />
              </div>

              {/* Speaker Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">About You (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background, experience, and what makes you qualified to speak on this topic..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[80px] resize-none"
                  disabled={isSending}
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <strong>What happens next?</strong> The organizers will review your proposal and get back to you.
              Make sure to check your Nostr DMs for updates!
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitProposal}
              disabled={!title.trim() || !description.trim() || isSending}
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}