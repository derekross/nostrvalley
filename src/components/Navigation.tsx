import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageCircle, Radio, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginArea } from '@/components/auth/LoginArea';
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog';
import { cn } from '@/lib/utils';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/community', label: 'Community', icon: MessageCircle },
  { path: '/schedule', label: 'Events', icon: Calendar },
  { path: '/speakers', label: 'People', icon: Users },
  { path: '/live', label: 'Live', icon: Radio },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/nv-logo.png"
                alt="Nostr Valley"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-lg font-bold">Nostr Valley</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <SubmitProposalDialog>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Propose a Talk
                </Button>
              </SubmitProposalDialog>
              <LoginArea className="max-w-48 hidden sm:flex" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[56px]",
                  location.pathname === path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            ))}

            {/* Propose a Talk - mobile */}
            <SubmitProposalDialog>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[56px] text-muted-foreground hover:text-foreground">
                <Lightbulb className="h-5 w-5" />
                <span className="text-[10px] font-medium">Propose</span>
              </button>
            </SubmitProposalDialog>
          </div>
        </div>
      </nav>
    </>
  );
}
