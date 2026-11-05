import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";

const DURATION = 6800;
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

    const c = canvas.current!;
    const g = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; g.scale(dpr, dpr);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#3b82f6";
    type P = { x: number; y: number; tx: number; ty: number };
    let pts: P[] = [];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logo.url;
    img.onload = () => {
      const S = 120, off = document.createElement("canvas");
      off.width = off.height = S;
      const o = off.getContext("2d")!;
      o.drawImage(img, 0, 0, S, S);
      const size = Math.min(W, H) * 0.42, ox = W / 2 - size / 2, oy = H / 2 - size / 2 - 40;
      let d: Uint8ClampedArray | null = null;
      try { d = o.getImageData(0, 0, S, S).data; } catch { /* tainted canvas */ }
      if (!d) {
        for (let i = 0; i < 500; i++) { const a = (i / 500) * Math.PI * 2, r = size / 2 * (0.85 + (i % 3) * 0.05);
          pts.push({ x: Math.random() * W, y: Math.random() * H, tx: W / 2 + Math.cos(a) * r, ty: H / 2 - 40 + Math.sin(a) * r }); }
        return;
      }
      const step = W < 700 ? 4 : 3;
      for (let y = 0; y < S; y += step) for (let x = 0; x < S; x += step)
        { const q = (y * S + x) * 4; if ((d[q + 3] ?? 0) > 120 && (d[q]! + d[q + 1]! + d[q + 2]!) > 300)
          pts.push({ x: Math.random() * W, y: Math.random() * H, tx: ox + (x / S) * size, ty: oy + (y / S) * size }); }
    };
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = now - t0;
      const k = Math.min(1, t / 3000), e = 1 - Math.pow(1 - k, 3);
      const pulse = t > 3000 ? 1 + Math.sin((t - 3000) / 250) * 0.04 : 1;
      g.clearRect(0, 0, W, H);
      g.fillStyle = color; g.strokeStyle = color;
      const cx = W / 2, cy = H / 2 - 40;
      const pos = pts.map((p) => ({
        x: cx + (p.x + (p.tx - p.x) * e - cx) * pulse,
        y: cy + (p.y + (p.ty - p.y) * e - cy) * pulse,
      }));
      g.globalAlpha = 0.15 * (1 - e * 0.6);
      for (let i = 0; i < pos.length; i += 3)
        for (let j = i + 3; j < Math.min(pos.length, i + 40); j += 3) {
          const a = pos[i]!, b = pos[j]!; const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy < 900) { g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
        }
      g.globalAlpha = 1; g.shadowBlur = 8; g.shadowColor = color;
      for (const p of pos) g.fillRect(p.x, p.y, 1.8, 1.8);
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
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); audio.current?.ctx.close(); pts = []; };
  }, [show]);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (muted) a.ctx.suspend(); else a.ctx.resume();
  }, [muted]);

  if (!show) return null;
  return (
    <div className={`fixed inset-0 z-[100] bg-background transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <img src={logo.url} alt="SK Team" className="splash-logo absolute left-1/2 top-[calc(50%-40px)] w-[42vmin] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_var(--primary)]" />
      <p dir="ltr" className="absolute inset-x-0 bottom-[22%] text-center font-mono text-xl md:text-3xl font-bold tracking-widest text-gradient">
        {typed}<span className="animate-pulse text-primary">▍</span>
      </p>
      <button onClick={() => setMuted(!muted)} aria-label="sound"
        className="absolute bottom-5 end-5 glass rounded-full p-3 text-muted-foreground hover:text-primary">
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
}
