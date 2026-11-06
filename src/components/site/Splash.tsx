import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { Button } from "@/components/ui/button";
import { assemblyProgress, SPLASH_DURATION } from "@/lib/splash-motion";

const DURATION = SPLASH_DURATION;
const TEXT = "Travel to the Future";

export function Splash() {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);
  const [typed, setTyped] = useState("");
  const [muted, setMuted] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const audio = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("sk-splash")) return;
    sessionStorage.setItem("sk-splash", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    // Sound: soft synth pad; stays silent if the browser blocks autoplay
    try {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + DURATION / 1000);
      [220, 277.2, 329.6].forEach((f) => {
        const o = ctx.createOscillator();
        o.type = "sine"; o.frequency.value = f;
        o.connect(master); o.start(); o.stop(ctx.currentTime + DURATION / 1000);
      });
      audio.current = { ctx, master };
    } catch { /* no audio */ }

    const c = canvas.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; g.scale(dpr, dpr);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    const size = Math.min(W, H) * 0.42;
    const cx = W / 2, cy = H / 2 - 40;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    type P = { x: number; y: number; tx: number; ty: number; lag: number };
    let pts: P[] = [];
    const add = (tx: number, ty: number) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = size * (0.18 + Math.random() * 0.5);
      pts.push({ x: tx + Math.cos(angle) * distance, y: ty + Math.sin(angle) * distance,
        tx, ty, lag: Math.random() * 1000 });
    };
    // Analytical sampling guarantees an unbroken circle, including its top.
    const ringCount = W < 700 ? 720 : 1100;
    for (let i = 0; i < ringCount; i++) {
      const angle = i / ringCount * Math.PI * 2;
      add(cx + Math.cos(angle) * size * 0.464, cy + Math.sin(angle) * size * 0.464);
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const S = 180, off = document.createElement("canvas");
      off.width = off.height = S;
      const o = off.getContext("2d");
      if (!o) return;
      o.drawImage(img, 0, 0, S, S);
      const ox = cx - size / 2, oy = cy - size / 2;
      let d: Uint8ClampedArray | null = null;
      try { d = o.getImageData(0, 0, S, S).data; } catch { /* tainted canvas */ }
      if (!d) return;
      const step = W < 700 ? 4 : 3;
      for (let y = 0; y < S; y += step) for (let x = 0; x < S; x += step)
        { const q = (y * S + x) * 4; if ((d[q + 3] ?? 0) > 120 && ((d[q] ?? 0) + (d[q + 1] ?? 0) + (d[q + 2] ?? 0)) > 300
          && Math.hypot(x - S / 2, y - S / 2) < S * 0.43)
          add(ox + (x / S) * size, oy + (y / S) * size); }
    };
    img.src = logo.url;
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = now - t0;
      const k = Math.min(1, t / 5800);
      const pulse = !reducedMotion && t > 5800 ? 1 + Math.sin((t - 5800) / 700) * 0.004 : 1;
      g.clearRect(0, 0, W, H);
      g.fillStyle = color; g.strokeStyle = color;
      // dew-like settle: each particle eases in gently with its own small delay
      const pos = pts.map((p) => {
        const e = reducedMotion ? 1 : assemblyProgress(t, p.lag);
        return {
          x: cx + (p.x + (p.tx - p.x) * e - cx) * pulse,
          y: cy + (p.y + (p.ty - p.y) * e - cy) * pulse,
        };
      });
      g.globalAlpha = 0.025 * (1 - k);
      g.lineWidth = 0.3;
      for (let i = 0; i < pos.length; i += 12)
        for (let j = i + 12; j < Math.min(pos.length, i + 36); j += 12) {
          const a = pos[i], b = pos[j];
          if (!a || !b) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy < 500) { g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
        }
      g.globalAlpha = 0.65; g.shadowBlur = 1.5; g.shadowColor = color;
      for (const p of pos) g.fillRect(p.x, p.y, 0.55, 0.55);
      // A continuous hairline bridges subpixel gaps once the dust has settled.
      g.globalAlpha = Math.max(0, Math.min(0.65, (t - 5200) / 900));
      g.lineWidth = 0.65;
      g.beginPath(); g.arc(cx, cy, size * 0.464 * pulse, 0, Math.PI * 2); g.stroke();
      g.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // typing
    const timers: number[] = [];
    [...TEXT].forEach((_, i) => timers.push(window.setTimeout(() => {
      setTyped(TEXT.slice(0, i + 1));
      const a = audio.current;
      if (a && a.ctx.state === "running" && a.master.gain.value >= 0) {
        const o = a.ctx.createOscillator(), gn = a.ctx.createGain();
        o.type = "square"; o.frequency.value = 1800 + Math.random() * 400;
        gn.gain.setValueAtTime(0.03, a.ctx.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.0001, a.ctx.currentTime + 0.04);
        o.connect(gn); gn.connect(a.ctx.destination); o.start(); o.stop(a.ctx.currentTime + 0.05);
      }
    }, 3300 + i * 110)));
    timers.push(window.setTimeout(() => setFade(true), DURATION - 600));
    timers.push(window.setTimeout(() => setShow(false), DURATION));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); img.onload = null; void audio.current?.ctx.close(); pts = []; };
  }, [show]);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (muted) a.ctx.suspend(); else a.ctx.resume();
  }, [muted]);

  if (!show) return null;
  return (
    <div className={`fixed inset-0 z-[100] bg-background transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
      <img src={logo.url} alt="SK Team" className="splash-logo absolute left-1/2 top-[calc(50%-40px)] w-[42vmin] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_var(--primary)]" />
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <p dir="ltr" className="absolute inset-x-0 bottom-[22%] text-center font-mono text-xl md:text-3xl font-bold text-gradient">
        {typed}<span className="animate-pulse text-primary">▍</span>
      </p>
      <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)} aria-label={muted ? "روشن کردن صدا" : "قطع صدا"} title={muted ? "روشن کردن صدا" : "قطع صدا"}
        className="absolute bottom-5 end-5 glass rounded-full text-muted-foreground hover:text-primary">
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
