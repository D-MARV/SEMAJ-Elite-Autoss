// src/EngineStart.tsx  (same folder as App.tsx)
import { useCallback, useEffect, useRef, useState } from 'react';
import { Power } from 'lucide-react';

const CLIP_SECONDS = 10; // every clip is trimmed to this length, whatever the file length
const FADE_IN = 0.8; // seconds, 0% -> 100% at the start
const FADE_OUT = 0.8; // seconds, 100% -> 0% at the end (starts at 9.2s of a 10s clip)
const INTERRUPT_MS = 500; // rapid fade when the user leaves the card / opens a modal / scrolls away

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Click-only engine audio.
 * - Nothing plays until start() is called (wire it ONLY to a click handler).
 * - Plays at most CLIP_SECONDS, fading in and out.
 * - interrupt() fades out in 0.5s, stops, and rewinds to 0:00.
 * Attach `audioRef` to an <audio preload="metadata"> element.
 */
export function useEngineAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef(0);
  const playingRef = useRef(false);
  const interruptRef = useRef<{ from: number; startedAt: number } | null>(null);
  const [playing, setPlaying] = useState(false);

  // Hard stop: pause, rewind to 0:00, unlock the button.
  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    interruptRef.current = null;
    playingRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    }
    setPlaying(false);
  }, []);

  // Runs every frame while playing: sets the volume from the playhead position.
  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !playingRef.current) return;

    const interrupt = interruptRef.current;
    if (interrupt) {
      const progress = (performance.now() - interrupt.startedAt) / INTERRUPT_MS;
      if (progress >= 1) return reset();
      audio.volume = clamp01(interrupt.from * (1 - progress));
    } else {
      const t = audio.currentTime;
      const end = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.min(CLIP_SECONDS, audio.duration) : CLIP_SECONDS;
      if (audio.ended || t >= end) return reset();
      audio.volume = clamp01(Math.min(t / FADE_IN, (end - t) / FADE_OUT));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [reset]);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || playingRef.current) return; // button locking: ignore clicks while playing
    playingRef.current = true;
    setPlaying(true);
    interruptRef.current = null;
    audio.currentTime = 0;
    audio.volume = 0;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(reset);
    rafRef.current = requestAnimationFrame(tick);
  }, [reset, tick]);

  const interrupt = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !playingRef.current || interruptRef.current) return;
    interruptRef.current = { from: audio.volume, startedAt: performance.now() };
  }, []);

  // Also stop if the tab is hidden, and clean up on unmount.
  useEffect(() => {
    const onHide = () => document.hidden && interrupt();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    };
  }, [interrupt]);

  return { audioRef, playing, start, interrupt };
}

/** The "Start engine" ignition button. Glows and locks itself while `playing` is true. */
export function IgnitionButton({ playing, onStart, className = '' }: { playing: boolean; onStart: () => void; className?: string }) {
  return (
    <button
      type="button"
      // aria-disabled (not the disabled attribute) so a click on it can never fall through to the card underneath.
      aria-disabled={playing}
      aria-label={playing ? 'Engine running' : 'Start engine'}
      data-testid="button-start-engine"
      className={`ignition-btn ${playing ? 'is-running' : ''} ${className}`}
      onClick={(e) => {
        e.stopPropagation(); // never open the vehicle modal from this button
        if (!playing) onStart();
      }}
    >
      <Power size={14} />
      <span>{playing ? 'Engine running' : 'Start engine'}</span>
    </button>
  );
}