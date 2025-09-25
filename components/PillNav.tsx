"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'pill' | 'underline';
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor ,
  onMobileMenuClick,
  initialLoadAnimation = true,
  ctaLabel,
  ctaHref,
  variant = 'pill'
}) => {
  const resolvedPillTextColor = pillTextColor ?? 'rgb(71, 85, 105)';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      }
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrolled = window.scrollY > 8;
      el.dataset.scrolled = scrolled ? 'true' : 'false';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll as EventListener);
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '48px',
    ['--logo']: '40px',
    ['--pill-pad-x']: '20px',
    ['--pill-gap']: '4px'
  } as React.CSSProperties;

  return (
    <>
      {variant === 'pill' ? (
        <div className="absolute top-[1em] z-[1000] w-full left-0 md:w-auto md:left-1/2 md:-translate-x-1/2">
          <nav
            className={`w-full md:w-max flex items-center justify-between md:justify-center box-border px-4 md:px-0 ${className}`}
            aria-label="Primary"
            style={cssVars}
          >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={(el: HTMLAnchorElement | null) => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)'
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={(el: HTMLAnchorElement | null) => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)'
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </a>
        )}

        {variant === 'underline' ? (
          <div
            ref={navItemsRef}
            className="relative items-center hidden md:flex ml-4"
            style={{ height: 'var(--nav-h)' }}
          >
            <ul role="menubar" className="list-none flex items-center m-0 p-0 h-full gap-2">
              {items.map((item) => {
                const isActive = activeHref === item.href;
                const baseClasses = `relative inline-flex items-center justify-center h-full px-3 font-medium text-[15px] tracking-wide text-slate-700 hover:text-white transition-colors duration-300`;
                const underline = `after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-2 after:h-[2px] after:rounded-full after:bg-blue-600 after:transition-all after:duration-200 ${isActive ? 'after:opacity-100 after:scale-x-100' : 'after:opacity-0 after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100'}`;
                return (
                  <li key={item.href} role="none" className="flex h-full">
                    {isRouterLink(item.href) ? (
                      <Link role="menuitem" href={item.href} className={`${baseClasses} ${underline}`} aria-label={item.ariaLabel || item.label}>
                        {item.label}
                      </Link>
                    ) : (
                      <a role="menuitem" href={item.href} className={`${baseClasses} ${underline}`} aria-label={item.ariaLabel || item.label}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div
            ref={navItemsRef}
            className="relative items-center rounded-full hidden md:flex ml-2 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
            style={{
              height: 'var(--nav-h)'
            }}
          >
            <ul
              role="menubar"
              className="list-none flex items-stretch m-0 p-[3px] h-full"
              style={{ gap: 'var(--pill-gap)' }}
            >
              {items.map((item, i) => {
                const isActive = activeHref === item.href;

                const pillStyle: React.CSSProperties = {
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--pill-text, rgb(71, 85, 105))',
                  paddingLeft: 'var(--pill-pad-x)',
                  paddingRight: 'var(--pill-pad-x)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                  transition: 'color 0.3s ease'
                };

                const PillContent = (
                  <>
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        willChange: 'transform'
                      }}
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack relative inline-block leading-[1] z-[2]">
                      <span
                        className="pill-label relative z-[2] inline-block leading-[1]"
                        style={{ willChange: 'transform' }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                        style={{
                          color: 'var(--hover-text, rgba(255, 255, 255, 1))',
                          willChange: 'transform, opacity'
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>
                    {isActive && item.href !== '/vision-scan' && item.href !== '/' && (
                      <span
                        className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4] backdrop-blur-xl border border-white/30"
                        style={{ 
                          background: 'rgba(59, 130, 246, 0.6)',
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                const basePillClasses =
                  'relative overflow-hidden inline-flex items-center justify-center h-full rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0 transition-colors duration-300 hover:text-white after:content-[""] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:rounded-full after:bg-blue-600 after:opacity-0 after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100 after:transition-all after:duration-200';

                return (
                  <li key={item.href} role="none" className="flex h-full">
                    {isRouterLink(item.href) ? (
                      <Link
                        role="menuitem"
                        href={item.href}
                        className={basePillClasses}
                        style={pillStyle}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        {PillContent}
                      </Link>
                    ) : (
                      <a
                        role="menuitem"
                        href={item.href}
                        className={basePillClasses}
                        style={pillStyle}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        {PillContent}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {ctaLabel && ctaHref && (
          isRouterLink(ctaHref) ? (
            <Link
              href={ctaHref}
              className="hidden md:inline-flex items-center justify-center ml-2 h-[var(--nav-h)] rounded-full px-5 font-semibold uppercase tracking-[0.2px] backdrop-blur-xl bg-blue-600 text-white shadow-lg border border-white/30 hover:bg-blue-700 hover:shadow-xl transition-all"
              aria-label={ctaLabel}
            >
              {ctaLabel}
            </Link>
          ) : (
            <a
              href={ctaHref}
              className="hidden md:inline-flex items-center justify-center ml-2 h-[var(--nav-h)] rounded-full px-5 font-semibold uppercase tracking-[0.2px] backdrop-blur-xl bg-blue-600 text-white shadow-lg border border-white/30 hover:bg-blue-700 hover:shadow-xl transition-all"
              aria-label={ctaLabel}
            >
              {ctaLabel}
            </a>
          )
        )}

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)'
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'rgba(71, 85, 105, 0.9)' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'rgba(71, 85, 105, 0.9)' }}
          />
        </button>
          </nav>

          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-[3em] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top backdrop-blur-xl bg-white/10 border border-white/20"
            style={{
              ...cssVars
            }}
          >
            <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map(item => {
            const defaultStyle: React.CSSProperties = {
              background: 'rgba(255, 255, 255, 0.9)',
              color: 'rgba(71, 85, 105, 0.9)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            };
            const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
            };
            const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = 'rgba(71, 85, 105, 0.9)';
            };

            const linkClasses =
              'block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
            </ul>
            {ctaLabel && ctaHref && (
              <div className="p-2 pt-0">
                {isRouterLink(ctaHref) ? (
                  <Link
                    href={ctaHref}
                    className="block text-center py-3 px-4 text-[16px] font-semibold rounded-[50px] transition-all bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {ctaLabel}
                  </Link>
                ) : (
                  <a
                    href={ctaHref}
                    className="block text-center py-3 px-4 text-[16px] font-semibold rounded-[50px] transition-all bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {ctaLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pointer-events-none"
          style={{
            transition: 'box-shadow 200ms ease, background-color 200ms ease',
            background: 'transparent'
          }}
          data-scrolled="false"
        >
          <div
            className="mt-4 w-full md:w-auto md:left-1/2 md:-translate-x-0 px-4 md:px-0 pointer-events-auto"
            style={{ maxWidth: '1200px' }}
          >
            <nav
              className={`w-full md:w-max flex items-center justify-between md:justify-center box-border ${className}`}
              aria-label="Primary"
              style={cssVars}
            >
              {isRouterLink(items?.[0]?.href) ? (
                <Link
                  href={items[0].href}
                  aria-label="Home"
                  onMouseEnter={handleLogoEnter}
                  role="menuitem"
                  ref={(el: HTMLAnchorElement | null) => {
                    logoRef.current = el;
                  }}
                  className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                  style={{
                    width: 'var(--nav-h)',
                    height: 'var(--nav-h)'
                  }}
                >
                  <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
                </Link>
              ) : (
                <a
                  href={items?.[0]?.href || '#'}
                  aria-label="Home"
                  onMouseEnter={handleLogoEnter}
                  ref={(el: HTMLAnchorElement | null) => {
                    logoRef.current = el;
                  }}
                  className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                  style={{
                    width: 'var(--nav-h)',
                    height: 'var(--nav-h)'
                  }}
                >
                  <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
                </a>
              )}

              {variant === 'underline' ? (
                <div
                  ref={navItemsRef}
                  className="relative items-center hidden md:flex ml-4"
                  style={{ height: 'var(--nav-h)' }}
                >
                  <ul role="menubar" className="list-none flex items-center m-0 p-0 h-full gap-2">
                    {items.map((item) => {
                      const isActive = activeHref === item.href;
                      const baseClasses = `relative inline-flex items-center justify-center h-full px-3 font-medium text-[15px] tracking-wide text-slate-700 hover:text-white transition-colors duration-300`;
                      const underline = `after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-2 after:h-[2px] after:rounded-full after:bg-blue-600 after:transition-all after:duration-200 ${isActive ? 'after:opacity-100 after:scale-x-100' : 'after:opacity-0 after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100'}`;
                      return (
                        <li key={item.href} role="none" className="flex h-full">
                          {isRouterLink(item.href) ? (
                            <Link role="menuitem" href={item.href} className={`${baseClasses} ${underline}`} aria-label={item.ariaLabel || item.label}>
                              {item.label}
                            </Link>
                          ) : (
                            <a role="menuitem" href={item.href} className={`${baseClasses} ${underline}`} aria-label={item.ariaLabel || item.label}>
                              {item.label}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {ctaLabel && ctaHref && (
                isRouterLink(ctaHref) ? (
                  <Link
                    href={ctaHref}
                    className="hidden md:inline-flex items-center justify-center ml-2 h-[var(--nav-h)] rounded-full px-5 font-semibold uppercase tracking-[0.2px] backdrop-blur-xl bg-blue-600 text-white shadow-lg border border-white/30 hover:bg-blue-700 hover:shadow-xl transition-all"
                    aria-label={ctaLabel}
                  >
                    {ctaLabel}
                  </Link>
                ) : (
                  <a
                    href={ctaHref}
                    className="hidden md:inline-flex items-center justify-center ml-2 h-[var(--nav-h)] rounded-full px-5 font-semibold uppercase tracking-[0.2px] backdrop-blur-xl bg-blue-600 text-white shadow-lg border border-white/30 hover:bg-blue-700 hover:shadow-xl transition-all"
                    aria-label={ctaLabel}
                  >
                    {ctaLabel}
                  </a>
                )
              )}

              <button
                ref={hamburgerRef}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl hover:bg-white/90 hover:scale-110 hover:shadow-2xl transition-all duration-300"
                style={{
                  width: 'var(--nav-h)',
                  height: 'var(--nav-h)'
                }}
              >
                <span
                  className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={{ background: 'rgba(71, 85, 105, 0.9)' }}
                />
                <span
                  className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={{ background: 'rgba(71, 85, 105, 0.9)' }}
                />
              </button>
            </nav>

            <div
              ref={mobileMenuRef}
              className="md:hidden absolute top-[3em] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top backdrop-blur-xl bg-white/10 border border-white/20"
              style={{
                ...cssVars
              }}
            >
              <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
                {items.map(item => {
                  const defaultStyle: React.CSSProperties = {
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: 'rgba(71, 85, 105, 0.9)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                  };
                  const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                  };
                  const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.color = 'rgba(71, 85, 105, 0.9)';
                  };

                  const linkClasses =
                    'block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

                  return (
                    <li key={item.href}>
                      {isRouterLink(item.href) ? (
                        <Link
                          href={item.href}
                          className={linkClasses}
                          style={defaultStyle}
                          onMouseEnter={hoverIn}
                          onMouseLeave={hoverOut}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={linkClasses}
                          style={defaultStyle}
                          onMouseEnter={hoverIn}
                          onMouseLeave={hoverOut}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              {ctaLabel && ctaHref && (
                <div className="p-2 pt-0">
                  {isRouterLink(ctaHref) ? (
                    <Link
                      href={ctaHref}
                      className="block text-center py-3 px-4 text-[16px] font-semibold rounded-[50px] transition-all bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {ctaLabel}
                    </Link>
                  ) : (
                    <a
                      href={ctaHref}
                      className="block text-center py-3 px-4 text-[16px] font-semibold rounded-[50px] transition-all bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {ctaLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PillNav;
