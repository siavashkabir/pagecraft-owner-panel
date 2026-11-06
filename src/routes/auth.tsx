import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود مدیر | SK Team" },
      { name: "description", content: "ورود به پنل مدیریت SK Team" },
      { property: "og:title", content: "ورود مدیر SK Team" },
      { property: "og:description", content: "ورود به پنل مدیریت" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error("ایمیل یا رمز اشتباه است"); return; }
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success("لینک تایید به ایمیل شما ارسال شد. پس از تایید وارد شوید.");
      setMode("in");
    }
  };
  return (
    <div dir="rtl" className="min-h-screen grid place-items-center px-4 grid-bg">
      <form onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-sm space-y-4">
        <img src={logo.url} alt="" className="h-20 mx-auto" />
        <h1 className="text-2xl font-black text-center">{mode === "in" ? "ورود به پنل مدیریت" : "ساخت حساب مدیر"}</h1>
        <Input type="email" required placeholder="ایمیل" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={6} placeholder="رمز عبور" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button disabled={busy} className="w-full rounded-full bg-gradient-primary text-primary-foreground">{mode === "in" ? "ورود" : "ثبت‌نام"}</Button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="text-sm text-muted-foreground w-full hover:text-primary">
          {mode === "in" ? "حساب ندارید؟ ثبت‌نام (اولین حساب، مدیر سایت می‌شود)" : "حساب دارید؟ ورود"}
        </button>
      </form>
    </div>
  );
}
