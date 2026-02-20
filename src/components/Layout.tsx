import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}
