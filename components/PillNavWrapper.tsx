"use client"

import PillNav from './PillNav';
import { usePathname } from 'next/navigation';

export default function PillNavWrapper() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50">
      <PillNav
        logo="/my-logo.png"
        logoAlt="NFCCure Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'NFC Tap', href: '/nfc-tap' },
          { label: 'AI Insights', href: '/ai-insights' },
          { label: 'Vision Scan', href: '/vision-scan' },
          { label: 'Auth', href: '/auth' }
        ]}
        activeHref={pathname}
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="rgba(255, 255, 255, 0.8)"
        pillColor="rgba(255, 255, 255, 0.9)"
        hoveredPillTextColor="rgba(255, 255, 255, 1)"
        pillTextColor="rgba(71, 85, 105, 0.9)"
        ctaLabel="Get Started"
        ctaHref="/auth"
        variant="pill"
      />
    </div>
  );
}
