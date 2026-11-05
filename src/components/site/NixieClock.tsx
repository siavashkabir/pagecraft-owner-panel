import { memo, useEffect, useState } from "react";

const Digit = memo(function Digit({ v, small }: { v: string; small?: boolean }) {
  return (
    <span className={`nixie-box ${small ? "h-6 w-4 text-sm" : "h-9 w-6 text-xl"}`}>
      <span key={v} className="nixie-digit">{v}</span>
    </span>
  );
});

export function NixieClock({ small, className = "" }: { small?: boolean; className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return (
    <div dir="ltr" className={`flex items-center gap-0.5 ${className}`} aria-label={now}>
      {[...now].map((ch, i) =>
        ch === ":" ? <span key={i} className="text-primary animate-pulse px-0.5">:</span> : <Digit key={i} v={ch} small={!!small} />,
      )}
    </div>
  );
}
