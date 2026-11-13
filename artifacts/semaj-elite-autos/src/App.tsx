import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

import semajLogoColor from '@assets/SEMAJ_Elite_Autos_Logo_1200.webp';
import { IgnitionButton, useEngineAudio } from './EngineStart';
import { VideoTestimonial } from './VideoTestimonial';
import engineAston from '@assets/freesound_community-037970_auston-martin-rapide-start-engine-engine-revs-amp-stut-offwav-73193.mp3';
import engineCadillac from '@assets/freesound_community-cadillac-escalade-engine-mp3-103267.mp3';
import engineStartA from '@assets/freesound_community-car-engine-start-44357.mp3';
import engineStartB from '@assets/freesound_community-car-engine-start-44357 (1).mp3';
import engineSoumages from '@assets/soumages-car-engine-335601.mp3';
import {
  ArrowUpRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Gauge,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Volume2,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import type { LucideIcon } from 'lucide-react';
import { Preloader } from './Preloader'; // adjust to your actual path
import showroomHero from '@assets/luxury-cars-lined-up-modern-dealership-showroom-sale-row-show_1790120909623.webp';
import mercedesHero from '@assets/pexels-furkanakt-34852197_1790120909624.jpg';
import founderPortrait from '@assets/Semaj_1_1790120909625.jpg';
import founderFactory from '@assets/Semaj_3_1790120909624.jpg';
import founderInspection from '@assets/Semaj Vechicle Inspection.jpg';
import founderInspectionn from '@assets/Mercedes Interior 2.jpg';
import undercarriage from '@assets/Semaj_5_1790120909622.jpg';
// NEW LOGO: upload SEMAJ_Elite_Autos_Badge_2k_white.png into attached_assets, then make this import
// match the exact filename your project gives it (Replit appends a numeric suffix).
import crvFront from '@assets/2018 Honda CR-V (SUV) FV.jpg';
import crvRear from '@assets/2018 Honda CR-V (SUV) RV.jpg';
import crvInterior from '@assets/2018 Honda CR-V (SUV) IV.jpg';
import corollaFront from '@assets/2015 Toyota Corolla S FV.jpg';
import corollaRear from '@assets/2015 Toyota Corolla S RV.jpg';
import corollaInterior from '@assets/2015 Toyota Corolla S IV.jpg';
import camryFront from '@assets/2013 Toyota Camry SE FV.jpg';
import camryRear from '@assets/2013 Toyota Camry SE RV.jpg';
import camryInterior from '@assets/2013 Toyota Camry SE IV.jpg';
import AccordFront from '@assets/2013 Honda Accord (Gen 9) FV.jpg';
import AccordRear from '@assets/2013 Honda Accord (Gen 9) RV.jpg';
import AccordInterior from '@assets/2013 Honda Accord (Gen 9) IV.jpg';
import LexusESFront from '@assets/2015 Lexus ES350 FV.jpg';
import LexusESRear from '@assets/2015 Lexus ES350 RV.jpg';
import LexusESInterior from '@assets/2015 Lexus ES350 IV.jpg';
import LexusRXFront from '@assets/2022 Lexus RX350 FV.jpg';
import LexusRXRear from '@assets/2022 Lexus RX350 RV.jpg';
import LexusRXInterior from '@assets/2022 Lexus RX350 IV.jpg';
import BenzC300Front from '@assets/Mercedes_Benz_C300_2012_FV.jpg';
import BenzC300Rear from '@assets/Mercedes_Benz_C300_2012_RV.jpg';
import BenzC300Interior from '@assets/Mercedes_Benz_C300_2012_IV.jpg';
import Benz2015Front from '@assets/2015 Mercedes Benz C300 FV.jpg';
import Benz2015Rear from '@assets/2015 Mercedes Benz C300 RV.jpg';
import Benz2015Interior from '@assets/2015 Mercedes Benz C300 IV.jpg';
import HyundaiElantraFront from '@assets/2017 Hyundai Elentra FV.jpg';
import HyundaiElantraRear from '@assets/2017 Hyundai Elentra RV.jpg';
import HyundaiElantraInterior from '@assets/2017 Hyundai Elentra IV.jpg';
import HyundaiTucsonFront from '@assets/Hyundai Tucson 2015 FV.jpg';
import HyundaiTucsonRear from '@assets/Hyundai Tucson 2015 RV.jpg';
import HyundaiTucsonInterior from '@assets/Hyundai Tucson 2015 IV.jpg';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Vehicle = {
  id: string;
  title: string;
  brand: string;
  status: 'Foreign Used' | 'On Hold' | 'Recently Sold';
  price: string;
  type: 'SUV' | 'Saloon';
  engine: string;
  transmission: string;
  mileage: string;
  lastUpdated: string;
  images: string[];
  engineSound?: string;
};

const LISTING_LAST_UPDATED = '13 Nov 2026';
const vehicles: Vehicle[] = [
  { id: 'CAR-001', title: '2022 Lexus RX 350 (SUV)', brand: 'Lexus', type: 'SUV', status: 'Foreign Used', price: '₦50,000,000', engine: '3.5L V6 (275 hp)', transmission: '6-Speed Auto', mileage: '~115,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [LexusRXFront, LexusRXRear, LexusRXInterior], engineSound: engineCadillac },
  { id: 'CAR-002', title: '2018 Honda CR-V (SUV)', brand: 'Honda', type: 'SUV', status: 'Foreign Used', price: '₦22,000,000', engine: '2.4L 4-Cyl (185 hp)', transmission: '5-Speed Auto', mileage: '~110,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [crvFront, crvRear, crvInterior], engineSound: engineStartA },
  { id: 'CAR-003', title: '2017 Hyundai Elantra', brand: 'Hyundai', type: 'Saloon', status: 'Foreign Used', price: '₦13,800,000', engine: '2.0L 4-Cyl (147 hp)', transmission: '6-Speed Auto', mileage: '~85,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [HyundaiElantraFront, HyundaiElantraRear, HyundaiElantraInterior], engineSound: engineSoumages },
  { id: 'CAR-004', title: '2015 Toyota Corolla S', brand: 'Toyota', type: 'Saloon', status: 'Foreign Used', price: '₦13,000,000', engine: '1.8L 4-Cyl (132 hp)', transmission: 'CVT Auto', mileage: '~95,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [corollaFront, corollaRear, corollaInterior], engineSound: engineStartB },
  { id: 'CAR-005', title: '2015 Lexus ES 350', brand: 'Lexus', type: 'Saloon', status: 'On Hold', price: '₦15,500,000', engine: '3.5L V6 (272 hp)', transmission: '6-Speed Auto', mileage: '~120,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [LexusESFront, LexusESRear, LexusESInterior], engineSound: engineCadillac },
  { id: 'CAR-006', title: '2015 Mercedes-Benz C300 (W205)', brand: 'Mercedes-Benz', type: 'Saloon', status: 'Recently Sold', price: '₦18,500,000', engine: '2.0L Turbo 4-Cyl', transmission: '7-Speed Auto', mileage: '~90,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [Benz2015Front, Benz2015Rear, Benz2015Interior], engineSound: engineAston },
  { id: 'CAR-007', title: '2015 Hyundai Tucson (SUV)', brand: 'Hyundai', type: 'SUV', status: 'Foreign Used', price: '₦12,500,000', engine: '2.0L 4-Cyl (164 hp)', transmission: '6-Speed Auto', mileage: '~98,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [HyundaiTucsonFront, HyundaiTucsonRear, HyundaiTucsonInterior], engineSound: engineStartA },
  { id: 'CAR-008', title: '2013 Honda Accord ("Gen 9")', brand: 'Honda', type: 'Saloon', status: 'Foreign Used', price: '₦12,800,000', engine: '2.4L 4-Cyl (185 hp)', transmission: 'CVT Auto', mileage: '~105,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [AccordFront, AccordRear, AccordInterior], engineSound: engineSoumages },
  { id: 'CAR-009', title: '2013 Toyota Camry SE V6', brand: 'Toyota', type: 'Saloon', status: 'Foreign Used', price: '₦13,500,000', engine: '4L 4-Cyl (178 hp)', transmission: '6-Speed Auto', mileage: '~110,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [camryFront, camryRear, camryInterior], engineSound: engineStartB },
  { id: 'CAR-010', title: '2012 Mercedes-Benz C300 (W204)', brand: 'Mercedes-Benz', type: 'Saloon', status: 'Foreign Used', price: '₦13,500,000', engine: '3.0L V6 (228 hp)', transmission: '7-Speed Auto', mileage: '~100,000 mi', lastUpdated: LISTING_LAST_UPDATED, images: [BenzC300Front, BenzC300Rear, BenzC300Interior], engineSound: engineAston },
];

const STATUSES = ['All vehicles', 'Foreign Used', 'On Hold', 'Recently Sold'];
const BRANDS = ['All brands', 'Toyota', 'Lexus', 'Mercedes-Benz', 'Honda', 'Hyundai'];
const YEARS = [...new Set(vehicles.map((vehicle) => Number(vehicle.title.match(/\b(?:19|20)\d{2}\b/)?.[0])))].sort((a, b) => b - a);
const PRICE_FILTERS = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under ₦15m', min: 0, max: 15_000_000 },
  { label: '₦15m–under ₦25m', min: 15_000_000, max: 25_000_000 },
  { label: '₦25m+', min: 25_000_000, max: Infinity },
];
const priceValue = (vehicle: Vehicle) => Number(vehicle.price.replace(/[^\d]/g, ''));
const yearValue = (vehicle: Vehicle) => Number(vehicle.title.match(/\b(?:19|20)\d{2}\b/)?.[0]);
const MotionContext = createContext(false);
const useMotionPaused = () => useContext(MotionContext);

/**
 * Hero framing controls (change these if a photo still looks off):
 * - 'cover'   : fills the hero. `position` = CSS object-position (x y) decides which part stays visible.
 * - 'contain' : shows the WHOLE photo (no crop/zoom) on a blurred copy of itself.
 */
const HERO_SLIDES: { src: string; fit: 'cover' | 'contain'; position?: string }[] = [
  { src: mercedesHero, fit: 'cover', position: 'center 58%' },
  { src: showroomHero, fit: 'cover', position: 'center 55%' },
  { src: founderInspectionn, fit: 'cover', position: 'center 28%'},
];

const whatsapp = (message: string) => `https://wa.me/2349015270689?text=${encodeURIComponent(message)}`;
const dealerMessage = 'Hello SEMAJ, I would like to speak with you about available vehicles you have for sale.';
const viewLabels = ['Front view', 'Rear view', 'Interior view'];

const MAP_SRC = 'https://www.openstreetmap.org/export/embed.html?bbox=3.545%2C6.420%2C3.665%2C6.510&layer=mapnik&marker=6.4698%2C3.5852';
const MAP_LINK = 'https://www.openstreetmap.org/?mlat=6.4698&mlon=3.5852#map=15/6.4698/3.5852';

/* ------------------------------------------------------------------ */
/* Navigation + scrolling                                              */
/* ------------------------------------------------------------------ */

const HEADER_OFFSET = 92;

type NavItem = { label: string; route?: string; section?: string; center?: boolean };

const navItems: NavItem[] = [
  { label: 'Home', section: 'top' },
  { label: 'Showroom', route: '/showroom' },
  { label: 'Custom sourcing', section: 'custom', center: true },
  { label: 'Founder', section: 'founder', center: true },
  { label: 'Reviews', section: 'reviews', center: true },
  { label: 'Contact', section: 'contact' },
];

// A section to scroll to once the homepage has mounted (used when navigating from another page).
let pendingSection: { id: string; center: boolean } | null = null;

function scrollToSection(id: string, center: boolean) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const fits = center && rect.height <= vh - HEADER_OFFSET;
  const top = fits ? window.scrollY + rect.top - (vh - rect.height) / 2 : window.scrollY + rect.top - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function useNav() {
  const [location, navigate] = useLocation();
  const toSection = (id: string, center = false) => {
    if (location === '/') scrollToSection(id, center);
    else {
      pendingSection = { id, center };
      navigate('/');
    }
  };
  const go = (item: NavItem) => {
    if (item.route) {
      if (location === item.route) window.scrollTo({ top: 0, behavior: 'smooth' });
      else navigate(item.route);
      return;
    }
    toSection(item.section ?? 'top', Boolean(item.center));
  };
  return { go, toSection, navigate };
}

/** Resets scroll to the top on every page change (the page itself fades in via .page-enter). */
function ScrollManager() {
  const [location] = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);
  return null;
}

/** Re-reads window.location.search whenever wouter (or the browser) changes the URL. */
function useQueryString() {
  const [q, setQ] = useState(() => window.location.search);
  useEffect(() => {
    const update = () => setQ(window.location.search);
    const events = ['popstate', 'pushState', 'replaceState'];
    events.forEach((e) => window.addEventListener(e, update));
    return () => events.forEach((e) => window.removeEventListener(e, update));
  }, []);
  return q;
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Logo({ className = '' }: { className?: string }) {
  return <img src={semajLogoColor} alt="SEMAJ Elite Autos" className={`semaj-logo ${className}`} />;
}


/** Scroll-reveal wrapper: fades, slides and scales its children in once they enter the viewport. */
function Reveal({ children, className = '', delay = 0, variant = 'up' }: { children: ReactNode; className?: string; delay?: number; variant?: 'up' | 'left' | 'right' | 'scale' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv rv-${variant} ${shown ? 'rv-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Custom cursor (global, one instance)                                */
/* ------------------------------------------------------------------ */

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]';
const colorCache = new Map<string, boolean | null>();
let probe: CanvasRenderingContext2D | null = null;

/** true = crimson/obsidian surface (cursor must invert), false = light surface, null = transparent. */
function classifyColor(css: string): boolean | null {
  if (colorCache.has(css)) return colorCache.get(css) as boolean | null;
  let result: boolean | null = null;
  try {
    if (!probe) probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (probe) {
      probe.clearRect(0, 0, 1, 1);
      probe.fillStyle = css;
      probe.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
      if (a >= 128) {
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const crimson = r > 140 && g < 75 && b < 75;
        result = crimson || luminance < 70;
      }
    }
  } catch {
    result = null;
  }
  colorCache.set(css, result);
  return result;
}

function surfaceNeedsLightCursor(start: Element | null): boolean {
  let el: Element | null = start;
  while (el && el !== document.documentElement) {
    if (el.hasAttribute('data-cursor-invert')) return true;
    const verdict = classifyColor(getComputedStyle(el).backgroundColor);
    if (verdict !== null) return verdict;
    el = el.parentElement;
  }
  return false;
}

function Cursor() {
  const motionPaused = useMotionPaused();
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    let teardown: () => void = () => {};

    const setup = () => {
      teardown();
      teardown = () => {};
      if (motionPaused || !mq.matches) return; // touch devices keep the native cursor and native touch behaviour

      const ring = document.createElement('div');
      const dot = document.createElement('div');
      ring.className = 'cursor-ring';
      dot.className = 'cursor-dot';
      document.body.append(ring, dot);
      document.body.classList.add('custom-cursor');

      let mx = -100, my = -100, rx = -100, ry = -100;
      let scale = 1, targetScale = 1;
      let hovering = false, pressed = false, light = false, visible = false;
      let lastTone = 0, moved = false, raf = 0;
      let lastTarget: Element | null = null;

      const paint = () => {
        ring.classList.toggle('is-hovering', hovering);
        dot.classList.toggle('is-hovering', hovering);
        ring.classList.toggle('is-light', light);
        dot.classList.toggle('is-light', light);
      };

      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        moved = true;
        lastTarget = e.target as Element | null;
        if (!visible) {
          visible = true;
          rx = mx;
          ry = my;
          ring.style.opacity = '1';
          dot.style.opacity = '1';
        }
        hovering = Boolean(lastTarget?.closest?.(INTERACTIVE));
        targetScale = pressed ? 0.85 : hovering ? 1.7 : 1;
      };
      const onDown = () => { pressed = true; targetScale = 0.85; };
      const onUp = () => { pressed = false; targetScale = hovering ? 1.7 : 1; };
      const onLeave = () => { visible = false; ring.style.opacity = '0'; dot.style.opacity = '0'; };

      const tick = (now: number) => {
        rx += (mx - rx) * 0.16; // inertia
        ry += (my - ry) * 0.16;
        scale += (targetScale - scale) * 0.2;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${hovering ? 0.5 : 1})`;
        if (moved && now - lastTone > 80) {
          lastTone = now;
          moved = false;
          light = surfaceNeedsLightCursor(lastTarget);
        }
        paint();
        raf = requestAnimationFrame(tick);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mousedown', onDown);
      window.addEventListener('mouseup', onUp);
      document.documentElement.addEventListener('mouseleave', onLeave);
      raf = requestAnimationFrame(tick);

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
        document.documentElement.removeEventListener('mouseleave', onLeave);
        document.body.classList.remove('custom-cursor');
        ring.remove();
        dot.remove();
      };
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      mq.removeEventListener('change', setup);
      teardown();
    };
  }, [motionPaused]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Header / floating button / footer                                   */
/* ------------------------------------------------------------------ */

function Header({ overHero = false }: { overHero?: boolean }) {
  const { go } = useNav();
  const motionPaused = useMotionPaused();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Flat at the top; becomes a floating pill once you scroll past the hero (or 40px on inner pages).
  useEffect(() => {
    const onScroll = () => {
      const hero = overHero ? document.getElementById('hero') : null;
      const limit = hero ? hero.offsetHeight - 80 : 40;
      setFloating(window.scrollY > limit);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [overHero]);

  useEffect(() => {
    const onOutside = (event: PointerEvent) => {
      if (mobileOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) setMobileOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [mobileOpen]);

  const renderLink = (item: NavItem) => (
    <a
      key={item.label}
      href={item.route ?? '/'}
      onClick={(e) => {
        e.preventDefault();
        setMobileOpen(false);
        go(item);
      }}
      data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
      className="nav-link"
    >
      {item.label}
    </a>
  );

  return (
    <header ref={headerRef} className={`site-header ${floating ? 'header-float' : 'header-flat'}`}>
      <div className="header-inner">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            go(navItems[0]);
          }}
          data-testid="link-logo"
          className="logo-link"
        >
          <Logo />
        </a>
        <nav className="desktop-nav">{navItems.map(renderLink)}</nav>
        <a href={whatsapp(dealerMessage)} target="_blank" rel="noreferrer" data-testid="link-talk-dealer" className="shimmer dealer-header-cta">Talk to dealer <ArrowUpRight size={14} /></a>
        <button onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileOpen} data-testid="button-mobile-menu" className="mobile-menu-button"><Menu size={21} /></button>
      </div>
      {mobileOpen && <div className="mobile-nav">{navItems.map(renderLink)}</div>}
    </header>
  );
}

function FloatingDealer() {
  return <div className="floating-dealer-group" aria-label="Contact SEMAJ">
    <a href="tel:+2349015270689" className="floating-dealer floating-dealer-call" data-testid="link-floating-call"><Phone size={17} /><span>Call</span></a>
    <a href={whatsapp(dealerMessage)} target="_blank" rel="noreferrer" className="floating-dealer shimmer" data-testid="link-floating-dealer"><MessageCircle size={17} /><span>WhatsApp</span></a>
  </div>;
}

function Footer() {
  const { go, navigate } = useNav();
  const social = [
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/james-ajayi-/', label: 'LinkedIn' },
    { Icon: MessageCircle, href: whatsapp(dealerMessage), label: 'WhatsApp' },
    { Icon: Phone, href: 'tel:+2349015270689', label: 'Call SEMAJ' },
  ];
  const company: NavItem[] = [
    { label: 'Custom sourcing', section: 'custom', center: true },
    { label: 'Founder', section: 'founder', center: true },
    { label: 'Reviews', section: 'reviews', center: true },
    { label: 'Achievements', section: 'achievements' },
  ];
  const link = (item: NavItem) => (
    <a key={item.label} href={item.route ?? '/'} onClick={(e) => { e.preventDefault(); go(item); }}>{item.label}</a>
  );
  return (
    <footer className="site-footer" data-cursor-invert="">
      <div className="footer-inner">
        <div className="footer-intro">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="footer-brand-lockup" aria-label="SEMAJ Elite Autos home">
            <img src="/favicon.svg" alt="" className="footer-logo" />
            <span className="footer-brand-copy"><strong>SEMAJ ELITE AUTOS</strong><small>Vehicle details. Direct contact. A clearer path to your next car.</small></span>
          </a>
          <a href={whatsapp('Hello SEMAJ, I would like to plan a visit to the showroom in Lekki Phase 1.')} target="_blank" rel="noreferrer" className="footer-cta">Plan a showroom visit <ArrowUpRight size={16} /></a>
        </div>
        <div className="footer-grid">
          <div>
            <p className="footer-label">Quick links</p>
            <div className="footer-links">{navItems.map(link)}</div>
          </div>
          <div>
            <p className="footer-label">Inventory</p>
            <div className="footer-links">
              <a href="/showroom" onClick={(e) => { e.preventDefault(); navigate('/showroom'); }}>All vehicles</a>
              {BRANDS.slice(1).map((b) => (
                <a key={b} href="/showroom" onClick={(e) => { e.preventDefault(); navigate(`/showroom?brand=${encodeURIComponent(b)}`); }}>{b}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-label">Company</p>
            <div className="footer-links">{company.map(link)}</div>
          </div>
          <div>
            <p className="footer-label">Contact info</p>
            <div className="footer-links">
              <span className="footer-line"><MapPin size={15} /> Lekki Phase 1, Lagos, Nigeria</span>
              <a href="tel:+2349015270689"><Phone size={15} /> +234 901 527 0689</a>
              <a href={whatsapp(dealerMessage)} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp"><MessageCircle size={15} /> Request a private viewing</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SEMAJ Elite Autos. All rights reserved.</span>
          <div className="footer-socials">{social.map(({ Icon, href, label }) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={label} className="social-badge"><Icon size={16} /></a>)}</div>
          <span>Clear sourcing. Direct access.</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */

function FounderModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="founder-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div className="founder-modal" role="dialog" aria-modal="true" aria-labelledby="founder-dialog-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="founder-modal-header">
          <div className="founder-modal-heading"><p className="eyebrow">The standard behind SEMAJ</p><h2 id="founder-dialog-title" className="founder-modal-title">A car is only as good as the person checking it.</h2></div>
          <button onClick={onClose} aria-label="Close founder story" data-testid="button-close-founder" className="founder-modal-close"><X size={19} /></button>
        </div>
        <div className="founder-modal-content">
          <div className="founder-portrait-frame"><img src={founderPortrait} alt="Semaj, founder of SEMAJ Elite Autos" /></div>
          <div className="founder-modal-copy">
            <p className="founder-modal-lead">Meet Semaj, founder of SEMAJ Elite Autos in Lekki Phase 1, Lagos.</p>
            <p>When considering a vehicle, ask for its current condition information, available history and customs paperwork. Review documents for the specific car before making a decision.</p>
            <div className="founder-proof-grid">
              <div className="founder-proof-card"><ShieldCheck className="mb-3 text-[#c5161d]" size={21} /><strong>Vehicle history</strong><span>Ask what records are available.</span></div>
              <div className="founder-proof-card"><BadgeCheck className="mb-3 text-[#c5161d]" size={21} /><strong>Customs documents</strong><span>Request paperwork for this car.</span></div>
            </div>
            <a href={whatsapp('Hello Semaj, I would like to ask about a vehicle in the SEMAJ showroom.')} target="_blank" rel="noreferrer" className="founder-modal-cta shimmer">Ask about a vehicle <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function VehicleModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const engine = useEngineAudio();
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('vehicle-dialog-open');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('vehicle-dialog-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  const message = `Hello SEMAJ, I am interested in ${vehicle.title}. Listed price: ${vehicle.price}. Listing status: ${vehicle.status}. Please share the latest dated inspection report and confirm the current condition and customs/duty status.`;
  return <div className="vehicle-modal-overlay" role="presentation" onMouseDown={onClose}>
    <div className="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="vehicle-dialog-title" onMouseDown={(e) => e.stopPropagation()}>
      <button onClick={onClose} aria-label="Close vehicle details" data-testid="button-close-vehicle" className="vehicle-modal-close"><X size={19} /></button>
      <div className="vehicle-modal-gallery">
        <div className="absolute inset-0">{vehicle.images.map((image, index) => <img key={image} src={image} alt={`${vehicle.title} ${viewLabels[index].toLowerCase()}`} className={`vehicle-modal-image ${index === active ? 'is-active' : ''}`} />)}</div>
        <span className="view-badge vehicle-modal-view">{viewLabels[active]}</span>
        <button onClick={() => setActive((active + vehicle.images.length - 1) % vehicle.images.length)} aria-label="Previous image" data-testid="button-gallery-previous" className="vehicle-gallery-arrow vehicle-gallery-previous"><ChevronLeft size={18} /></button>
        <button onClick={() => setActive((active + 1) % vehicle.images.length)} aria-label="Next image" data-testid="button-gallery-next" className="vehicle-gallery-arrow vehicle-gallery-next"><ChevronRight size={18} /></button>
        <div className="vehicle-gallery-dots">{vehicle.images.map((image, index) => <button key={image} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} aria-pressed={index === active} data-testid={`button-gallery-${index}`} className={`fx-none h-1.5 flex-1 rounded-full ${index === active ? 'bg-[#c5161d]' : 'bg-[#202326]/25'}`} />)}</div>
      </div>
      <div className="vehicle-modal-details">
        <button type="button" onClick={onClose} className="vehicle-back-button" data-testid="button-back-inventory"><ChevronLeft size={16} /> Back to inventory</button>
        <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#c5161d]"><CircleDot size={13} /> {vehicle.status}</span><span className="text-[10px] uppercase tracking-[.15em] text-[#747776]">{vehicle.id}</span></div>
        <h2 id="vehicle-dialog-title" className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-[-.04em] md:text-4xl">{vehicle.title}</h2>
        <div className="shimmer mt-5 inline-flex w-fit rounded-full bg-[#c5161d] px-5 py-2.5 font-display text-xl font-bold text-white">{vehicle.price}</div>
        <div className="mt-6 grid grid-cols-2 gap-3">{([{ label: 'Year', value: String(yearValue(vehicle)), Icon: Clock3 }, { label: 'Body type', value: vehicle.type, Icon: CarFront }, { label: 'Approx. mileage', value: vehicle.mileage, Icon: Gauge }, { label: 'Transmission', value: vehicle.transmission, Icon: CircleDot }, { label: 'Engine', value: vehicle.engine, Icon: Gauge }, { label: 'Availability', value: vehicle.status, Icon: BadgeCheck }] as { label: string; value: string; Icon: LucideIcon }[]).map(({ label, value, Icon }) => <div key={label} className="vehicle-detail-spec"><Icon size={17} className="mb-3 text-[#65747c]" /><span className="block text-[10px] uppercase tracking-[.13em] text-[#747776]">{label}</span><strong className="mt-1 block text-sm">{value}</strong></div>)}</div>
        <p className="mt-3 text-xs text-[#747776]">Listing last updated {vehicle.lastUpdated}. Confirm current price and availability with the dealer.</p>
        <section className="mt-4 rounded-2xl border border-[#dbd2c7] p-4" aria-labelledby="vehicle-checks-title"><h3 id="vehicle-checks-title" className="font-display text-lg font-semibold">Condition &amp; paperwork</h3><p className="mt-2 text-sm leading-6 text-[#636766]">Ask the dealer to confirm the vehicle’s current condition and customs/duty status, and to share the latest dated inspection report. No dated inspection report is attached to this listing.</p><p className="mt-2 text-xs text-[#747776]">Gallery photos show the vehicle; they are not a substitute for an inspection report.</p></section>
        <div className="mt-5"><div className="flex items-center gap-3 border-t border-[#dbd2c7] py-4 text-sm text-[#636766]">{vehicle.engineSound && <audio ref={engine.audioRef} src={vehicle.engineSound} preload="metadata" />}<button onClick={engine.start} aria-disabled={engine.playing} aria-label="Play engine sound effect" data-testid="button-engine-audio" className={`engine-audio-button ${engine.playing ? 'is-running' : ''}`}><Volume2 size={16} /></button><span><strong className="block text-[#252829]">{engine.playing ? 'Sound effect playing' : 'Engine sound effect'}</strong><span className="text-xs">{vehicle.engineSound ? 'Tap to play an optional sound effect.' : 'Ask the dealer whether a recording of this car is available.'}</span></span></div><a href={whatsapp(message)} target="_blank" rel="noreferrer" aria-label="Ask about this vehicle on WhatsApp" data-testid={`link-inspect-whatsapp-${vehicle.id}`} className="vehicle-whatsapp-link shimmer"><span>Ask about this vehicle</span><MessageCircle size={18} aria-hidden="true" /></a></div>
      </div>
    </div>
  </div>;
}

/* ------------------------------------------------------------------ */
/* Vehicle card (shared by Showroom grid and the home carousel)        */
/* ------------------------------------------------------------------ */

function VehicleCard({ vehicle, onSelect, paused, showEngine = false }: { vehicle: Vehicle; onSelect: (vehicle: Vehicle) => void; paused: boolean; showEngine?: boolean }) {
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const engine = useEngineAudio();
  const motionPaused = useMotionPaused();
  const { interrupt } = engine;
  const canStart = showEngine && Boolean(vehicle.engineSound);

  useEffect(() => {
    if (paused || motionPaused || hovered) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % vehicle.images.length), 3500);
    return () => window.clearInterval(timer);
  }, [paused, motionPaused, hovered, vehicle.images.length]);

  // Scrolled away (less than 20% of the card visible) -> fade out, stop, rewind to 0:00.
  useEffect(() => {
    const el = cardRef.current;
    if (!canStart || !el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) interrupt(); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [canStart, interrupt]);

  const open = () => {
    interrupt(); // opening the modal stops the engine audio
    onSelect(vehicle);
  };

  return <div ref={cardRef} role="button" tabIndex={0} onClick={open} onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(); } }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); interrupt(); }} data-testid={`card-vehicle-${vehicle.id}`} className="vehicle-card group block w-full cursor-pointer overflow-hidden rounded-[22px] border border-[#d8d8d4] bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#c5161d] hover:shadow-[0_18px_40px_rgba(32,35,38,.12)]">
    <div className="relative aspect-[1.35] overflow-hidden bg-[#ded7ce]">
      <div className="absolute inset-0">{vehicle.images.map((image, index) => <img key={image} src={image} alt={`${vehicle.title} ${viewLabels[index].toLowerCase()}`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === slide ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`} />)}</div>
      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <span className={`flex items-center gap-2 rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] ${vehicle.status === 'Recently Sold' ? 'bg-[#24272a] text-white' : vehicle.status === 'On Hold' ? 'bg-[#fff1d6] text-[#71500d]' : 'bg-white text-[#24272a]'}`}><span className={`h-1.5 w-1.5 rounded-full ${vehicle.status === 'Recently Sold' ? 'bg-white/60' : vehicle.status === 'On Hold' ? 'bg-[#c18a2c]' : 'bg-[#c5161d]'}`} />{vehicle.status}</span>
        {canStart && <><audio ref={engine.audioRef} src={vehicle.engineSound} preload="metadata" /><IgnitionButton playing={engine.playing} onStart={engine.start} /></>}
      </div>
      <span className="view-badge view-badge-small">{viewLabels[slide]}</span>
    </div>
    <div className="vehicle-card-content">
      <div className="flex items-start justify-between gap-3">
        <div><p className="vehicle-card-kicker">{yearValue(vehicle)} <span aria-hidden="true">/</span> {vehicle.type}</p><h3 className="mt-1 font-display text-xl font-bold leading-tight tracking-tight">{vehicle.title}</h3></div>
        <ArrowUpRight className="mt-1 shrink-0 text-[#c5161d] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
      </div>
      <p className="vehicle-card-price">{vehicle.price}</p>
      <div className="vehicle-card-specs" aria-label="Vehicle specifications">
        <span><small>Mileage</small>{vehicle.mileage}</span>
        <span><small>Transmission</small>{vehicle.transmission}</span>
      </div>
      <p className="vehicle-card-updated">Listing last updated {vehicle.lastUpdated}</p>
      <span className="vehicle-card-link">View vehicle details <ArrowUpRight size={14} /></span>
    </div>
  </div>;
}
/* ------------------------------------------------------------------ */
/* Showroom                                                            */
/* ------------------------------------------------------------------ */

function Showroom() {
  const search = useQueryString();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All vehicles');
  const [brand, setBrand] = useState('All brands');
  const [priceFilter, setPriceFilter] = useState('Any price');
  const [year, setYear] = useState('Any year');
  const [type, setType] = useState('All types');
  const [sort, setSort] = useState('Featured');
  const [selected, setSelected] = useState<Vehicle | null>(null);

  // Deep links: /showroom?car=CAR-003 (opens that vehicle) and /showroom?brand=Toyota (filters).
  useEffect(() => {
    const params = new URLSearchParams(search);
    const car = params.get('car');
    const brandParam = params.get('brand');
    const timers: number[] = [];
    const vehicle = car ? vehicles.find((v) => v.id === car) : undefined;
    if (vehicle || (brandParam && BRANDS.includes(brandParam))) {
      setQuery('');
      setStatus('All vehicles');
      setBrand(vehicle ? 'All brands' : (brandParam as string));
      timers.push(window.setTimeout(() => {
        const el = document.getElementById('inventory');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: 'smooth' });
      }, 150));
      if (vehicle) timers.push(window.setTimeout(() => setSelected(vehicle), 650));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [search]);

  const closeVehicle = () => {
    setSelected(null);
    if (new URLSearchParams(window.location.search).has('car')) window.history.replaceState(null, '', window.location.pathname);
  };

  const filtered = useMemo(() => {
    const range = PRICE_FILTERS.find((option) => option.label === priceFilter) ?? PRICE_FILTERS[0];
    const result = vehicles.filter((vehicle) =>
      (status === 'All vehicles' || vehicle.status === status)
      && (brand === 'All brands' || vehicle.brand === brand)
      && (type === 'All types' || vehicle.type === type)
      && (year === 'Any year' || yearValue(vehicle) === Number(year))
      && priceValue(vehicle) >= range.min
      && priceValue(vehicle) < range.max
      && `${vehicle.title} ${vehicle.brand} ${vehicle.type}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    if (sort === 'Price: low to high') result.sort((a, b) => priceValue(a) - priceValue(b));
    if (sort === 'Price: high to low') result.sort((a, b) => priceValue(b) - priceValue(a));
    if (sort === 'Newest year') result.sort((a, b) => yearValue(b) - yearValue(a));
    return result;
  }, [query, status, brand, priceFilter, year, type, sort]);
  const hasFilters = Boolean(query || status !== 'All vehicles' || brand !== 'All brands' || priceFilter !== 'Any price' || year !== 'Any year' || type !== 'All types');
  const clearFilters = () => {
    setQuery('');
    setStatus('All vehicles');
    setBrand('All brands');
    setPriceFilter('Any price');
    setYear('Any year');
    setType('All types');
    setSort('Featured');
  };

  return <div className="min-h-screen bg-[#f7f1e8]">
    <Header />
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 lg:px-10">
      <div className="reveal flex flex-col justify-between gap-8 border-b border-[#ddd4c8] pb-10 md:flex-row md:items-end">
        <div><p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#c5161d]"><span className="h-px w-7 bg-[#c5161d]" /> Lagos private showroom</p><h1 className="font-display text-5xl font-extrabold leading-[.96] tracking-[-.05em] md:text-7xl">Find your<br /><span className="text-[#73797c]">next drive.</span></h1></div>
        <p className="max-w-sm text-sm leading-7 text-[#555d61]">Compare vehicle details, then contact us to confirm current availability, condition and customs documents.</p>
      </div>
      <div id="inventory" className="reveal delay-1 mt-8 rounded-[22px] border border-[#d8d8d4] bg-white p-4 md:p-6">
        <label className="sr-only" htmlFor="vehicle-search">Search inventory</label>
        <div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#788083]" size={19} /><input id="vehicle-search" value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search make, model or year" data-testid="input-search-vehicles" className="h-14 w-full rounded-xl border border-[#d8d8d4] bg-[#f7f7f5] pl-14 pr-5 text-sm outline-none transition focus:border-[#c5161d]" /></div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter by availability">
          {STATUSES.map((item) => <button type="button" key={item} onClick={() => setStatus(item)} aria-pressed={status === item} data-testid={`button-status-${item.toLowerCase().replaceAll(' ', '-')}`} className={`filter-chip ${status === item ? 'filter-chip-active' : ''}`}>{item}</button>)}
        </div>
        <div className="filter-grid mt-5">
          <label className="filter-field"><span>Make</span><select className="filter-select" value={brand} onChange={(e) => setBrand(e.target.value)}>{BRANDS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="filter-field"><span>Price</span><select className="filter-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>{PRICE_FILTERS.map((item) => <option key={item.label}>{item.label}</option>)}</select></label>
          <label className="filter-field"><span>Year</span><select className="filter-select" value={year} onChange={(e) => setYear(e.target.value)}><option>Any year</option>{YEARS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="filter-field"><span>Vehicle type</span><select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}><option>All types</option><option>SUV</option><option>Saloon</option></select></label>
          <label className="filter-field"><span>Sort by</span><select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option><option>Newest year</option></select></label>
        </div>
      </div>
      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#555d61]" aria-live="polite"><strong className="text-[#17191b]">{filtered.length}</strong> {filtered.length === 1 ? 'vehicle' : 'vehicles'} found</p>
        {hasFilters && <button type="button" onClick={clearFilters} data-testid="button-clear-filters" className="text-sm font-bold text-[#a31218] underline underline-offset-4">Clear all filters</button>}
      </div>
      {filtered.length ? <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((vehicle, index) => <div key={vehicle.id} className={`reveal delay-${Math.min(index % 4, 3)}`}><VehicleCard vehicle={vehicle} paused={Boolean(selected)} onSelect={setSelected} showEngine /></div>)}</div> : <div className="mt-5 grid min-h-64 place-items-center rounded-[22px] border border-dashed border-[#cfc5b8] text-center"><div><CarFront className="mx-auto mb-3 text-[#a3aaa9]" size={30} /><p className="font-display text-xl">No matching vehicles</p><p className="mt-2 text-sm text-[#555d61]">Try adjusting your search or filters.</p><button onClick={clearFilters} data-testid="button-reset-filters" className="mt-5 rounded-full border border-[#17191b] px-5 py-2 text-xs font-bold uppercase tracking-[.12em]">Clear filters</button></div></div>}
      <p className="mt-8 max-w-3xl text-xs leading-5 text-[#6b7173]">Vehicle details and mileage are provided as listed and should be confirmed with the dealer. Ask for current condition information and customs/duty documents before purchase.</p>
    </main>
    <Footer />
    {selected && <VehicleModal vehicle={selected} onClose={closeVehicle} />}
  </div>;
}

/* ------------------------------------------------------------------ */
/* Home sections                                                       */
/* ------------------------------------------------------------------ */

function Testimonials() {
  return <div className="h-full rounded-[22px] bg-[#202326] p-7 text-white md:p-9">
    <MessageCircle className="mb-8 text-[#ff555b]" size={25} />
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/60">Customer feedback</p>
    <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-.04em] md:text-4xl">Hear it from a real buyer.</h3>
    <p className="mt-4 max-w-md text-sm leading-6 text-white/70">We only share customer feedback with permission. Ask us whether a recent buyer is available to speak with you.</p>
    <a href={whatsapp('Hello SEMAJ, could you share customer feedback or a buyer reference with their permission?')} target="_blank" rel="noreferrer" className="feedback-cta mt-7" aria-label="Ask for buyer feedback">
      <span>Ask for buyer feedback</span><ArrowUpRight size={16} aria-hidden="true" />
    </a>
  </div>;
}

function Achievements() {
  return <section id="achievements" className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-10 lg:pb-24">
    <Reveal>
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c5161d]">A transparent buying process</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-.05em] md:text-6xl">Check the facts before you commit.</h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-[#555d61]">Ask for current, vehicle-specific evidence and take time to review it before making a decision.</p>
      </div>
    </Reveal>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { n: '01', title: 'Inspect this car', body: 'Request a recent, dated inspection report and clear photos of any areas you want to check.' },
        { n: '02', title: 'Confirm the paperwork', body: 'Ask to review the current customs and duty documents for this specific vehicle.' },
        { n: '03', title: 'Verify the details', body: 'Confirm mileage, condition, price and availability with the dealer before travelling or paying.' },
      ].map((item) => (
        <Reveal key={item.n} variant="up">
          <article className="trust-step">
            <span>{item.n}</span><h3>{item.title}</h3><p>{item.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </section>;
}

function MapCard() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Touch screens only (the overlay is display:none on desktop).
  // First finger lands on the overlay -> page scrolls normally. The overlay then lets the
  // next finger through to the map, so map panning needs a second finger.
  const onTouchStart = () => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setNotice(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNotice(false), 1600);
    }
  };
  const onTouchEnd = () => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto';
  };

  return <div className="map-card">
    <iframe title="Map to SEMAJ Elite Autos in Lekki Phase 1, Lagos" src={MAP_SRC} className="h-full min-h-[380px] w-full border-0" loading="lazy" />
    <div ref={overlayRef} className="map-overlay" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
      <div className={`map-notice ${notice ? 'show' : ''}`}>Use two fingers to move the map</div>
    </div>
    <a href={MAP_LINK} target="_blank" rel="noreferrer" className="map-link">Get directions <ArrowUpRight size={15} /></a>
  </div>;
}

function ContactSection() {
  const empty = { name: '', phone: '', email: '', interest: '', message: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const set = (key: keyof typeof empty) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please tell us your name.');
    if (form.phone.replace(/\D/g, '').length < 7) return setError('Please enter a valid phone number.');
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError('That email address does not look right.');
    setError('');
    const text = [
      `Hello SEMAJ, my name is ${form.name.trim()}.`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : '',
      form.interest ? `I am interested in: ${form.interest}` : '',
      form.message.trim() ? `Message: ${form.message.trim()}` : '',
    ].filter(Boolean).join('\n');
    window.open(whatsapp(text), '_blank', 'noopener');
    setSent(true);
  };

  return <section id="contact" className="mx-auto max-w-[1440px] px-5 pb-20 pt-4 lg:px-10 lg:pb-28">
    <Reveal>
      <div className="grid gap-8 border-b border-[#ddd4c8] pb-10 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div>
          <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#d60000]"><span className="h-px w-7 bg-[#d60000]" /> Private showroom access</p>
          <h2 className="font-display text-4xl font-semibold leading-[.98] md:text-6xl">Come see<br /><span className="text-[#7a8588]">what feels right.</span></h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#687071]">Visit the SEMAJ showroom in Lekki Phase 1, Lagos, Nigeria, or speak with the dealer before you make the trip. We make remote buying feel considered too.</p>
      </div>
    </Reveal>
    <div className="mt-10 grid gap-5 lg:grid-cols-2">
      <Reveal variant="left" className="h-full">
        <form onSubmit={submit} noValidate className="contact-form">
          <p className="footer-label footer-label-dark">Send an enquiry</p>
          {sent ? (
            <div className="contact-success">
              <CheckCircle2 size={30} className="text-[#d60000]" />
              <p className="font-display text-2xl font-semibold">Your enquiry is ready in WhatsApp.</p>
              <p className="text-sm leading-6 text-[#687071]">WhatsApp should open with your enquiry ready. Review it and tap Send there; if it did not open, use the call or WhatsApp buttons on this page.</p>
              <button type="button" onClick={() => { setForm(empty); setSent(false); }} className="contact-submit contact-submit-outline">Send another enquiry</button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="contact-field"><span>Full name *</span><input className="contact-input" value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your name" /></label>
                <label className="contact-field"><span>Phone *</span><input className="contact-input" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" placeholder="+234 ..." /></label>
              </div>
              <label className="contact-field"><span>Email (optional)</span><input className="contact-input" type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" /></label>
              <label className="contact-field"><span>Vehicle of interest</span>
                <select className="contact-input" value={form.interest} onChange={set('interest')}>
                  <option value="">Not sure yet</option>
                  {vehicles.map((v) => <option key={v.id} value={v.title}>{v.title}</option>)}
                  <option value="Custom vehicle order">Custom vehicle order</option>
                </select>
              </label>
              <label className="contact-field"><span>Message</span><textarea className="contact-input contact-textarea" rows={4} value={form.message} onChange={set('message')} placeholder="Preferred make, model, budget or questions" /></label>
              {error && <p role="alert" className="contact-error">{error}</p>}
              <button type="submit" className="contact-submit shimmer" data-testid="button-contact-submit">Continue in WhatsApp <MessageCircle size={15} /></button>
            </>
          )}
        </form>
      </Reveal>
      <Reveal variant="right" delay={120} className="contact-map-reveal">
        <div className="showroom-map-column">
          <div className="showroom-map-heading"><p className="eyebrow">Showroom location</p><p>Lekki Phase 1, Lagos, Nigeria</p></div>
          <MapCard />
        </div>
      </Reveal>
    </div>
  </section>;
}

function Home() {
  const { toSection, navigate } = useNav();
  const motionPaused = useMotionPaused();
  const [hero, setHero] = useState(0);
  const [founderOpen, setFounderOpen] = useState(false);
  const [founderSlide, setFounderSlide] = useState(0);
  const founderImages = [
    { src: founderInspection, position: '50% 62%', caption: 'Vehicle inspection' },
    { src: founderFactory, position: '50% 50%', caption: 'Factory-floor inspection' },
    { src: undercarriage, position: '50% 58%', caption: 'Undercarriage inspection' },
  ];

  useEffect(() => {
    if (motionPaused) return;
    const timer = window.setInterval(() => setHero((h) => (h + 1) % HERO_SLIDES.length), 4500);
    return () => window.clearInterval(timer);
  }, [motionPaused]);
  useEffect(() => {
    if (motionPaused) return;
    const timer = window.setInterval(() => setFounderSlide((s) => (s + 1) % founderImages.length), 3000);
    return () => window.clearInterval(timer);
  }, [founderImages.length, motionPaused]);

  // Arriving from another page with a section target (e.g. Showroom -> Founder).
  useEffect(() => {
    if (!pendingSection) return;
    const t = window.setTimeout(() => {
      const p = pendingSection;
      pendingSection = null;
      if (p) scrollToSection(p.id, p.center);
    }, 350);
    return () => window.clearTimeout(t);
  }, []);

  return <div className="min-h-screen bg-[#f7f1e8]">
    <Header overHero />
    <main>
      {/* HERO */}
      <section id="hero" className="hero-section relative overflow-hidden bg-[#17191b] text-white">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => (
            <div key={slide.src} className={`absolute inset-0 transition-opacity duration-1000 ${index === hero ? 'opacity-100' : 'opacity-0'}`}>
              {slide.fit === 'contain' ? (
                <>
                  <img src={slide.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
                  <img src={slide.src} alt="" className="absolute inset-y-0 right-0 h-full w-full object-contain object-center lg:w-[62%] lg:object-right" />
                </>
              ) : (
                <img src={slide.src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: slide.position }} />
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,16,17,.9)_0%,rgba(14,16,17,.6)_45%,rgba(14,16,17,.12)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1011]/75 via-transparent to-transparent lg:hidden" />
        </div>
        <div className="hero-inner relative mx-auto flex max-w-[1440px] items-end justify-start px-5 pb-16 pt-32 lg:px-10 lg:pb-20">
          <div className="w-full max-w-full text-left lg:max-w-[75%]">
            <div className="reveal flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.23em] text-[#ff777b]"><span className="h-px w-10 bg-[#c5161d]" /> Lagos · Nigeria · Private showroom</div>
            <h1 className="hero-title reveal delay-1 mt-5 font-display font-extrabold">Premium<br /><span className="text-white/75">drives.</span><br /><span className="text-[#ed333b]">No doubt.</span></h1>
            <div className="reveal delay-2 mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/showroom')} data-testid="link-explore-showroom" className="shimmer flex items-center gap-3 rounded-full bg-[#d60000] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.14em] text-white">Explore showroom <ArrowUpRight size={17} /></button>
              <button onClick={() => toSection('custom', true)} data-testid="link-request-custom-order" className="flex items-center gap-3 rounded-full border border-white/35 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.14em] text-white">Request custom order <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="absolute bottom-28 right-5 flex items-center gap-3 text-[10px] uppercase tracking-[.18em] text-white/60 lg:right-10"><span>{String(hero + 1).padStart(2, '0')}</span><div className="h-px w-16 bg-white/30 lg:w-20"><div className="h-full bg-[#c5161d] transition-all duration-500" style={{ width: `${((hero + 1) / HERO_SLIDES.length) * 100}%` }} /></div><span>{String(HERO_SLIDES.length).padStart(2, '0')}</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24" aria-labelledby="featured-inventory-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow">Available vehicles</p><h2 id="featured-inventory-title" className="mt-3 font-display text-4xl font-extrabold tracking-[-.05em] md:text-5xl">A few worth a closer look.</h2></div>
          <button onClick={() => navigate('/showroom')} className="cta-outline" data-testid="link-view-all-vehicles">View all vehicles <ArrowUpRight size={16} /></button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.filter((vehicle) => vehicle.status === 'Foreign Used').slice(0, 3).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} paused={false} onSelect={(item) => navigate(`/showroom?car=${item.id}`)} />)}
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <Reveal variant="left"><div><p className="eyebrow">Buy with clarity</p><h2 className="mt-5 max-w-md font-display text-4xl font-extrabold leading-[1.02] tracking-[-.05em] md:text-6xl">The details matter.</h2></div></Reveal>
          <div className="grid gap-7 text-sm leading-7 text-[#687071] md:grid-cols-3">
            <Reveal delay={0}><div><ShieldCheck className="mb-5 text-[#c5161d]" size={23} /><strong className="block text-[#17191b]">Condition &amp; history</strong><p className="mt-2">Ask for current, vehicle-specific inspection and history information.</p></div></Reveal>
            <Reveal delay={120}><div><BadgeCheck className="mb-5 text-[#c5161d]" size={23} /><strong className="block text-[#17191b]">Customs documents</strong><p className="mt-2">Request the duty paperwork for the specific vehicle and review it.</p></div></Reveal>
            <Reveal delay={240}><div><MessageCircle className="mb-5 text-[#c5161d]" size={23} /><strong className="block text-[#17191b]">Talk directly</strong><p className="mt-2">Call or message the dealer with questions before arranging a visit.</p></div></Reveal>
          </div>
        </div>
      </section>

      {/* CUSTOM SOURCING */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-10 lg:pb-24">
        <div id="custom">
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[28px] bg-[#c8d0d0] p-7 md:p-12">
              <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border-[1px] border-[#879092]/30 md:h-96 md:w-96" />
              <div className="absolute -right-6 -top-6 h-52 w-52 rounded-full border-[1px] border-[#879092]/30 md:h-72 md:w-72" />
              <div className="relative max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#566164]">Looking for something specific?</p>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] md:text-6xl">Tell us what you want to drive next.</h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#566164]">Tell us the make, model, budget and features you want. We’ll discuss what can be sourced and which details can be confirmed before you decide.</p>
                <a href={whatsapp('Hello SEMAJ, I would like to request a custom vehicle order. My preferred make/model is: ')} target="_blank" rel="noreferrer" data-testid="link-custom-order-whatsapp" className="shimmer cta-dark mt-8">Start a custom order <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* ACHIEVEMENTS */}
      <Achievements />

      {/* VIDEO TESTIMONIAL */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-10 lg:pb-24" aria-label="Vehicle handover video">
        <div className="video-section-grid">
          <Reveal variant="left">
            <div>
              <p className="eyebrow">A closer look</p>
              <h2 className="mt-4 max-w-md font-display text-4xl font-extrabold leading-[1.02] tracking-[-.05em] md:text-6xl">See the handover.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#555d61]">This clip starts muted. Turn sound on only if you choose.</p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}><VideoTestimonial paused={motionPaused} /></Reveal>
        </div>
      </section>

      {/* REVIEWS + FOUNDER */}
      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-16 lg:grid-cols-[1fr_1fr] lg:px-10 lg:pb-24">
        <div id="reviews" className="h-full"><Reveal variant="left" className="h-full"><Testimonials /></Reveal></div>
        <div id="founder" className="h-full">
          <Reveal variant="right" className="h-full">
            <div className="founder-card grid min-h-[450px] grid-cols-1 gap-2 rounded-[28px] bg-[#e7ded2] p-2 md:grid-cols-[.9fr_1.1fr]">
              <div className="founder-media relative overflow-hidden rounded-[22px]">
                {founderImages.map((image, index) => (
                  <img key={image.src} src={image.src} alt={`SEMAJ vehicle inspection ${index + 1}`} style={{ objectPosition: image.position }} className={`founder-slide ${index === founderSlide ? 'is-active' : ''}`} />
                ))}
                <span className="founder-slide-caption">{founderImages[founderSlide].caption}</span>
              </div>
              <div className="founder-copy flex flex-col justify-between p-5 md:p-8">
                <div><p className="eyebrow">Meet the founder</p><h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.05] tracking-[-.04em] md:text-4xl">Good questions make better decisions.</h2><p className="mt-5 text-sm leading-7 text-[#555d61]">Speak with Semaj about the vehicle you’re considering and ask to review its available inspection and paperwork.</p></div>
                <button onClick={() => setFounderOpen(true)} data-testid="button-read-founder-story" className="mt-6 flex w-fit items-center gap-3 rounded-full border border-[#a69c91] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.13em]">Read founder's story <ArrowUpRight size={15} /></button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="overflow-hidden border-t border-[#ddd4c8] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 md:grid-cols-[1fr_auto] lg:px-10">
          <Reveal><div><p className="eyebrow">Visit us in Lekki Phase 1</p><h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-.05em] md:text-6xl">See it. Ask questions. Decide with care.</h2></div></Reveal>
          <Reveal delay={120}><button onClick={() => navigate('/showroom')} data-testid="link-browse-inventory" className="cta-outline">Browse inventory <ArrowUpRight size={16} /></button></Reveal>
        </div>
      </section>

      {/* CONTACT (moved here from its own page) */}
      <ContactSection />
    </main>
    <Footer />
    {founderOpen && <FounderModal onClose={() => setFounderOpen(false)} />}
  </div>;
}

/** Old /contact URLs land on the homepage contact section. */
function ContactRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    pendingSection = { id: 'contact', center: false };
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Router / App                                                        */
/* ------------------------------------------------------------------ */

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  const [location] = useLocation();
  return <RoutedErrorBoundary>
    <div key={location} className="page-enter">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/showroom" component={Showroom} />
        <Route path="/contact" component={ContactRedirect} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </RoutedErrorBoundary>;
}

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [motionPaused, setMotionPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event: MediaQueryListEvent) => setMotionPaused(event.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionContext.Provider value={motionPaused}>
        <div className={motionPaused ? 'motion-paused' : undefined}>
          <Preloader />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <ScrollManager />
            <Router />
            <FloatingDealer />
            <Cursor />
          </WouterRouter>
        </div>
      </MotionContext.Provider>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
