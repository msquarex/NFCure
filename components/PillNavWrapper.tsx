"use client"

import PillNav from './PillNav';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function PillNavWrapper() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="sticky top-0 z-50">
        <div className="absolute top-[1em] z-[1000] w-full left-0 md:w-auto md:left-1/2 md:-translate-x-1/2">
          <div className="w-full md:w-max flex items-center justify-center px-4 md:px-0">
            <div className="animate-pulse rounded-full bg-white/80 border border-white/40 shadow-xl" style={{ width: '48px', height: '48px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Navigation items based on authentication state
  const getNavigationItems = () => {
    if (!user) {
      // Only show Home and Auth when not logged in
      return [
        { label: 'Home', href: '/' },
        { label: 'Login', href: '/auth' }
      ];
    }
    
    // Show all items when logged in (except Auth)
    return [
      { label: 'Home', href: '/' },
      { label: 'NFC Tap', href: '/nfc-tap' },
      { label: 'AI Insights', href: '/ai-insights' },
      { label: 'Vision Scan', href: '/vision-scan' }
    ];
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <PillNav
        logo="/my-logo.png"
        logoAlt="NFCCure Logo"
        items={getNavigationItems()}
        activeHref={pathname}
        className="custom-nav"
        ctaLabel={user ? "Logout" : undefined}
        ctaHref={user ? "#" : undefined}
      />
      
      {/* Custom logout button overlay for authenticated users */}
      {user && (
        <div className="absolute top-[1em] right-4 z-[1001]">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hidden md:inline-flex items-center gap-2 rounded-full backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-105 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
