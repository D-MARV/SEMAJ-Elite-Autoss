// src/Preloader.tsx  (same folder as App.tsx, because App.tsx imports './Preloader')
import { useEffect, useState } from 'react';
// Upload SEMAJ_Elite_Autos_Logo_4K_transparent.png into attached_assets.
// If your project appends a numeric suffix to the file name, match it exactly here.
import semajLogo from '@assets/SEMAJ_Elite_Autos_Logo_1200.webp';

const MIN_TIME = 3000; // how long the preloader stays on screen (ms)
const FADE_MS = 500; // must match the opacity transition in .preloader (index.css)

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    const startedAt = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const remaining = Math.max(0, MIN_TIME - (performance.now() - startedAt));
      timers.push(
        window.setTimeout(() => {
          setExiting(true); // start fade-out
          timers.push(window.setTimeout(() => setLoading(false), FADE_MS));
        }, remaining),
      );
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);

    return () => {
      window.removeEventListener('load', finish);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Lock page scroll while the preloader is up (html is the scrolling element on this site).
  useEffect(() => {
    if (!loading) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = '';
    };
  }, [loading]);

  if (!loading) return null;

  // The shimmer layer uses the SAME logo image as a CSS mask, so the light sweep is clipped
  // strictly to the letters and lines. Nothing is drawn where the PNG is transparent.
  const mask = `url("${semajLogo}")`;

  return (
    <div className={`preloader ${exiting ? 'is-exiting' : ''}`} role="status" aria-label="Loading SEMAJ Elite Autos">
      <div className="preloader-logo">
        <img src={semajLogo} alt="SEMAJ Elite Autos" className="preloader-logo-img" draggable={false} />
        <div className="preloader-shine" aria-hidden="true" style={{ WebkitMaskImage: mask, maskImage: mask }} />
      </div>
    </div>
  );
}
