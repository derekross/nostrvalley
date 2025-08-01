import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageCircle } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/community', label: 'Community', icon: MessageCircle },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/speakers', label: 'Speakers', icon: Users },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/NV-Hero.png"
                alt="Nostr Valley"
                className="h-8 w-8 rounded object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-primary">Nostr Valley</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle and Login */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LoginArea className="max-w-48 hidden sm:flex" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {/* Navigation Items */}
            {navigationItems.map(({ path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md transition-colors min-w-[60px]",
                  location.pathname === path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">
                  {path === '/' ? 'Home' :
                   path === '/community' ? 'Community' :
                   path === '/schedule' ? 'Schedule' : 'Speakers'}
                </span>
              </Link>
            ))}

            {/* Login Area */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <LoginArea className="flex" compact />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}