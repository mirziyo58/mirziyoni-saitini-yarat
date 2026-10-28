import { useEffect, useRef, useState } from "react";
import { Pause, Play, Share2 } from "lucide-react";
import { wedding } from "@/config/site";
import { shareLink } from "@/lib/share";

/** Floating music + share control. Never autoplays before a user gesture. */
export function MusicControl({ startSignal }: { startSignal: number }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);

  const startSynth = async () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      // Soft ambient chord (Fmaj9) with slow tremolo
      [174.6, 220, 261.6, 329.6, 392].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.05;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08 + i * 0.03;
        const lg = ctx.createGain();
        lg.gain.value = 0.03;
        lfo.connect(lg).connect(g.gain);
        o.connect(g).connect(gain);
        o.start();
        lfo.start();
      });
      ctxRef.current = { ctx, gain };
    }
    const { ctx, gain } = ctxRef.current;
    await ctx.resume();
    gain.gain.setTargetAtTime(0.6, ctx.currentTime, 1.2);
  };
  const stopSynth = () => {
    const c = ctxRef.current;
    if (c) c.gain.gain.setTargetAtTime(0, c.ctx.currentTime, 0.4);
  };

  const play = async () => {
    try {
      if (wedding.musicSrc) {
        if (!audioRef.current) {
          audioRef.current = new Audio(wedding.musicSrc);
          audioRef.current.loop = true;
        }
        await audioRef.current.play();
      } else {
        await startSynth();
      }
      setPlaying(true);
      setError(false);
    } catch {
      setError(true);
      setPlaying(false);
    }
  };
  const pause = () => {
    audioRef.current?.pause();
    stopSynth();
    setPlaying(false);
  };

  useEffect(() => {
    if (startSignal > 0) void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSignal]);

  useEffect(() => () => {
    audioRef.current?.pause();
    void ctxRef.current?.ctx.close();
  }, []);

  return (
    <div className="fixed right-4 z-40 flex flex-col gap-2 safe-bottom">
      <button
        type="button"
        onClick={() => shareLink(`${wedding.groom} & ${wedding.bride}`, "To‘y taklifnomasi")}
        aria-label="Taklifnomani ulashish"
        className="glass flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-primary-foreground shadow-soft"
      >
        <Share2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={playing ? pause : play}
        aria-pressed={playing}
        aria-label={playing ? "Musiqani to‘xtatish" : "Musiqani yoqish"}
        title={error ? "Musiqani yoqib bo‘lmadi" : undefined}
        className="glass relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-primary-foreground shadow-soft"
      >
        {playing ? (
          <span className="flex h-4 items-end gap-0.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="animate-eq w-0.5 h-4 bg-gold" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        ) : (
          <Play className="h-4 w-4 translate-x-px" />
        )}
        {error && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />}
        <span className="sr-only">{playing ? <Pause /> : null}</span>
      </button>
    </div>
  );
}
