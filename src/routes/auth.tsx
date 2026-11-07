import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Languages, MailCheck } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { safeRedirect } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const redirect = safeRedirect(search.redirect);
    return redirect ? { redirect } : {};
  },
  head: () => ({
    meta: [
      { title: "ورود یا ثبت‌نام | SK Team" },
      { name: "description", content: "ورود مشتریان به حساب SK Team برای مشاهده سفارش‌ها و اشتراک‌ها" },
      { property: "og:title", content: "ورود یا ثبت‌نام SK Team" },
      { property: "og:description", content: "دسترسی به داشبورد سفارش‌ها و اشتراک‌های SK Team" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function authError(error: Error, fa: boolean) {
  const message = error.message.toLowerCase();
  if (message.includes("invalid login")) return fa ? "ایمیل یا رمز عبور درست نیست." : "Email or password is incorrect.";
  if (message.includes("email not confirmed")) return fa ? "ابتدا لینک تأیید ارسال‌شده به ایمیل را باز کنید." : "Please confirm your email first.";
  if (message.includes("already registered")) return fa ? "این ایمیل قبلاً ثبت شده است؛ وارد شوید." : "This email is already registered; sign in instead.";
  return fa ? "عملیات انجام نشد. اطلاعات را بررسی کنید و دوباره تلاش کنید." : "The request could not be completed. Please check your details and try again.";
}

function AuthPage() {
  const nav = useNavigate();
  const { redirect: requestedRedirect } = Route.useSearch();
  const { lang, setLang } = useLang();
  const fa = lang === "fa";
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const destination = async (userId: string) => {
    if (requestedRedirect) return requestedRedirect;
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    return data ? "/admin" : "/dashboard";
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    if (mode === "in") {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) {
        setError(authError(signInError ?? new Error("No user"), fa));
        setBusy(false);
        return;
      }
      const target = await destination(data.user.id);
      nav({ href: target });
      return;
    }

    const target = requestedRedirect ?? "/dashboard";
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name.trim() },
        emailRedirectTo: `${window.location.origin}${target}`,
      },
    });
    setBusy(false);
    if (signUpError) {
      setError(authError(signUpError, fa));
      return;
    }
    if (data.session && data.user) {
      nav({ href: await destination(data.user.id) });
      return;
    }
    setConfirmed(true);
  };

  return (
    <div dir={fa ? "rtl" : "ltr"} className="min-h-screen grid place-items-center px-4 py-10 grid-bg">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-3">
          <Button variant="ghost" size="sm" onClick={() => setLang(fa ? "en" : "fa")} className="gap-1">
            <Languages className="h-4 w-4" />{fa ? "EN" : "فا"}
          </Button>
        </div>
        <div className="glass rounded-3xl p-8">
          <img src={logo.url} alt="SK Team" className="h-20 mx-auto mb-4" />
          {confirmed ? (
            <div className="text-center" role="status">
              <MailCheck className="h-12 w-12 text-accent mx-auto mb-5" />
              <h1 className="text-2xl font-black mb-3">{fa ? "ایمیل خود را تأیید کنید" : "Confirm your email"}</h1>
              <p className="text-sm text-muted-foreground leading-7 mb-6">{fa ? "لینک تأیید برای شما ارسال شد. پس از باز کردن لینک، وارد حساب خود می‌شوید و به مقصد قبلی بازمی‌گردید." : "We sent you a confirmation link. Open it to activate your account and return to your destination."}</p>
              <Button className="w-full" variant="outline" onClick={() => { setConfirmed(false); setMode("in"); }}>{fa ? "بازگشت به ورود" : "Back to sign in"}</Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-center mb-2">{fa ? "ورود یا ثبت‌نام" : "Sign in or create an account"}</h1>
              <p className="text-sm text-muted-foreground text-center leading-7 mb-6">{fa ? "برای مشاهده سفارش‌ها، اشتراک‌ها و کدهای فعال‌سازی" : "View your orders, subscriptions and activation codes"}</p>
              <form onSubmit={submit} className="space-y-4">
                {mode === "up" && <div className="space-y-2"><Label htmlFor="auth-name">{fa ? "نام نمایشی (اختیاری)" : "Display name (optional)"}</Label><Input id="auth-name" maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></div>}
                <div className="space-y-2"><Label htmlFor="auth-email">{fa ? "ایمیل" : "Email"}</Label><Input id="auth-email" type="email" required autoComplete="email" placeholder="name@example.com" dir="ltr" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="auth-password">{fa ? "رمز عبور" : "Password"}</Label><Input id="auth-password" type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} dir="ltr" value={password} onChange={(event) => setPassword(event.target.value)} /><p className="text-xs text-muted-foreground">{fa ? "حداقل ۸ نویسه" : "At least 8 characters"}</p></div>
                {error && <p role="alert" className="text-sm text-destructive leading-6">{error}</p>}
                <Button disabled={busy} className="w-full rounded-full bg-gradient-primary text-primary-foreground">{busy ? (fa ? "لطفاً صبر کنید…" : "Please wait…") : mode === "in" ? (fa ? "ورود" : "Sign in") : (fa ? "ثبت‌نام" : "Create account")}</Button>
              </form>
              <Button type="button" variant="ghost" onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(""); }} className="text-sm text-muted-foreground w-full mt-3 hover:text-primary">
                {mode === "in" ? (fa ? "حساب ندارید؟ ثبت‌نام" : "New here? Create an account") : (fa ? "حساب دارید؟ ورود" : "Already have an account? Sign in")}
              </Button>
            </>
          )}
        </div>
        <Button asChild variant="link" className="w-full mt-4 text-muted-foreground"><Link to="/">{fa ? "بازگشت به سایت" : "Back to the website"}</Link></Button>
      </div>
    </div>
  );
}
