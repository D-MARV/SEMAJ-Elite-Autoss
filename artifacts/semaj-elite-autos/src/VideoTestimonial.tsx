// src/VideoTestimonial.tsx  (same folder as App.tsx)
import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import testimonialVideo from '@assets/lv_0_20260929125513.mp4';

const FADE_MS = 500; // mute / unmute / scroll-back fade
const LEAVE_FADE_MS = 300; // quick fade when the video scrolls out of view

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function VideoTestimonial() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef(0);
  const wantsSoundRef = useRef(false); // the viewer's choice (survives scrolling away and back)
  const [soundOn, setSoundOn] = useState(false);

  // Smoothly moves video.volume from wherever it is now to `target`.
  const fadeTo = useCallback((target: number, ms: number, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) return;
    cancelAnimationFrame(fadeRef.current);
    const from = video.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - startedAt) / ms, 1);
      video.volume = clamp01(from + (target - from) * p);
      if (p < 1) fadeRef.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (wantsSoundRef.current) {
      wantsSoundRef.current = false;
      setSoundOn(false);
      fadeTo(0, FADE_MS, () => {
        if (!wantsSoundRef.current) video.muted = true;
      });
    } else {
      wantsSoundRef.current = true;
      setSoundOn(true);
      if (video.muted) {
        video.volume = 0; // start silent, then fade up
        video.muted = false;
      }
      if (video.paused) video.play().catch(() => {});
      fadeTo(1, FADE_MS);
    }
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    // React does not always write the muted attribute; browsers only autoplay muted videos.
    video.muted = true;
    video.play().catch(() => {});

    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Back in view: resume from the exact timestamp (pause() never rewinds).
          video.play().catch(() => {});
          if (wantsSoundRef.current) {
            if (video.muted) {
              video.volume = 0;
              video.muted = false;
            }
            fadeTo(1, FADE_MS);
          }
        } else if (wantsSoundRef.current && !video.muted) {
          // Out of view with sound on: fade to 0%, then pause.
          fadeTo(0, LEAVE_FADE_MS, () => video.pause());
        } else {
          cancelAnimationFrame(fadeRef.current);
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(fadeRef.current);
    };
  }, [fadeTo]);

  return (
    <div ref={wrapRef} className="video-card">
      <video ref={videoRef} className="video-card-media" src={testimonialVideo} autoPlay muted loop playsInline preload="metadata" />
      <div className="video-card-shade" aria-hidden="true" />
      <p className="video-caption">Real Moments, Real Satisfaction — Elite Delivery Experience</p>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Mute video' : 'Unmute video'}
        data-testid="button-video-sound"
        className="video-sound-btn"
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span>{soundOn ? 'Sound on' : 'Tap for sound'}</span>
      </button>
    </div>
  );
}