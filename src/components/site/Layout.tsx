import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Menu, X, Send, Mail, Instagram, Megaphone, Languages, ShieldCheck, Headphones, BadgeCheck, LogIn, UserRound, LayoutDashboard, LogOut } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { useLang } from "@/lib/lang";
import { settingsQuery } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ParticleBg } from "./ParticleBg";
import { NixieClock } from "./NixieClock";

const nav = [
  { to: "/", k: "home" },
  { to: "/shop", k: "bots" },
  { to: "/services", k: "services" },
  { to: "/about", k: "about" },
  { to: "/contact", k: "contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const { data: s } = useQuery(settingsQuery);
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ParticleBg />
      <header className="sticky top-0 z-40 glass border-x-0 border-t-0">
        <div className="mx-auto max-w-7xl px-4 h-18 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo.url} alt="SK Team" className="h-11 w-11 object-contain group-hover:scale-110 transition-transform" />
            <span dir="ltr" className="text-xl font-extrabold tracking-wide">SK<span className="text-gradient">.team</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors data-[status=active]:bg-primary/15 data-[status=active]:text-primary">
                {n.k === "bots" ? (lang === "fa" ? "فروشگاه" : "Store") : t(n.k)}
              </Link>
            ))}
          </nav>
          <NixieClock className="hidden lg:flex" />
          <div className="flex items-center gap-2">
            <AccountMenu />
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fa" ? "en" : "fa")} className="gap-1">
              <Languages className="h-4 w-4" />{lang === "fa" ? "EN" : "فا"}
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-primary text-primary-foreground shadow-glow rounded-full">
              <a href={s?.telegram_support || "https://t.me/Siavashska"} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{t("order")}</a>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden flex flex-col px-4 pb-4 gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }}
                className="px-4 py-3 rounded-xl text-muted-foreground data-[status=active]:bg-primary/15 data-[status=active]:text-primary">{n.k === "bots" ? (lang === "fa" ? "فروشگاه" : "Store") : t(n.k)}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="relative z-10 border-t border-border mt-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-7 grid sm:grid-cols-3 gap-6 border-b border-border">
          {[[ShieldCheck, lang === "fa" ? "شرایط روشن پیش از پرداخت" : "Clear terms before payment"], [Headphones, lang === "fa" ? "ارتباط مستقیم با پشتیبانی" : "Direct support contact"], [BadgeCheck, lang === "fa" ? "تحویل طبق شرایط سفارش" : "Delivery under order terms"]].map(([Icon, text]) => { const I = Icon as typeof ShieldCheck; return <div key={String(text)} className="flex items-center gap-3 text-sm"><I className="text-accent h-6 w-6 shrink-0" />{String(text)}</div>; })}
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo.url} alt="" className="h-10 w-10" />
              <span dir="ltr" className="text-lg font-bold">SK<span className="text-gradient">.team</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-7">{lang === "fa" ? s?.hero_desc_fa : s?.hero_desc_en}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {nav.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{t(n.k)}</Link>)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Social href={s?.telegram_support} icon={<Send className="h-4 w-4" />} label={t("support")} />
            <Social href={s?.telegram_channel} icon={<Megaphone className="h-4 w-4" />} label={t("channel")} />
            <Social href={s?.email ? `mailto:${s.email}` : undefined} icon={<Mail className="h-4 w-4" />} label={t("email")} />
            <Social href={s?.instagram} icon={<Instagram className="h-4 w-4" />} label={t("instagram")} />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <p className="text-xs text-muted-foreground leading-7 max-w-2xl">{lang === "fa" ? "شرایط تحویل، فعال‌سازی اشتراک، پشتیبانی و بازگشت وجه پیش از پرداخت برای هر سفارش مشخص می‌شود." : "Delivery, activation, support and refund terms are confirmed per order before payment."}</p>
          <div data-enamad-slot className="min-h-20 w-44" />
        </div>
        <NixieClock small className="lg:hidden justify-center mb-3" />
        <p className="text-center text-xs text-muted-foreground pb-8">© {new Date().getFullYear()} — {t("rights")}</p>
      </footer>
    </div>
  );
}

function AccountMenu() {
  const { lang } = useLang();
  const fa = lang === "fa";
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { data: account, isLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      return { email: data.user.email ?? "", isAdmin: Boolean(isAdmin) };
    },
    staleTime: 60_000,
  });
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  };
  if (isLoading) return <Button variant="ghost" size="sm" disabled aria-label={fa ? "بررسی حساب" : "Checking account"}><UserRound className="h-4 w-4" /></Button>;
  if (!account) return <Button asChild variant="ghost" size="sm"><Link to="/auth"><LogIn className="h-4 w-4" /><span className="hidden xs:inline">{fa ? "ورود" : "Sign in"}</span></Link></Button>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><UserRound className="h-4 w-4" /><span className="hidden sm:inline">{fa ? "حساب من" : "Account"}</span></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel dir="ltr" className="truncate text-xs font-normal">{account.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard />{fa ? "داشبورد" : "Dashboard"}</Link></DropdownMenuItem>
        {account.isAdmin && <DropdownMenuItem asChild><Link to="/admin"><ShieldCheck />{fa ? "پنل مدیریت" : "Admin panel"}</Link></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive"><LogOut />{fa ? "خروج" : "Sign out"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Social({ href, icon, label }: { href?: string | undefined; icon: ReactNode; label: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="glass rounded-xl px-3 py-2 flex items-center gap-2 hover:border-primary hover:text-primary transition-colors">
      {icon}{label}
    </a>
  );
}
