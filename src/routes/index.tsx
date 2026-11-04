import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Zap, ShieldCheck, Headphones, Send, MessageCircle, Code2, Rocket } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { Button } from "@/components/ui/button";
import { BotCard } from "@/components/site/BotCard";
import { botsQuery, servicesQuery, settingsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { ServiceIcon } from "./services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SK Team | با SK Team به آینده سفر کنید" },
      { name: "description", content: "ربات‌های هوشمند تلگرام، طراحی وب‌سایت و اتوماسیون شبکه‌های اجتماعی توسط SK Team." },
      { property: "og:title", content: "SK Team | Travel to the Future" },
      { property: "og:description", content: "ربات‌های هوشمند تلگرام و طراحی سایت اختصاصی." },
    ],
  }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(settingsQuery), queryClient.ensureQueryData(botsQuery), queryClient.ensureQueryData(servicesQuery)]),
  component: Home,
});

function Home() {
  const { t, lang } = useLang();
  const { data: s } = useSuspenseQuery(settingsQuery);
  const { data: bots } = useSuspenseQuery(botsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const fa = lang === "fa";
  return (
    <>
      <section className="relative grid-bg">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-accent mb-6">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />Telegram · Eitaa · Bale · Rubika
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.3] mb-6">
              <span className="text-gradient">{fa ? s.hero_title_fa : s.hero_title_en}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-8 mb-8 max-w-xl">{fa ? s.hero_desc_fa : s.hero_desc_en}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                <Link to="/bots">{t("viewBots")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={s.telegram_support} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{t("order")}</a>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
              {[[`${bots.length}+`, t("stat1")], ["500+", t("stat2")], ["24/7", t("stat3")]].map(([n, l]) => (
                <div key={l}><div className="text-3xl font-black text-gradient" dir="ltr">{n}</div><div className="text-xs text-muted-foreground mt-1">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative grid place-items-center aspect-square max-w-md mx-auto w-full">
            <div className="absolute inset-8 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute inset-0 rounded-full border border-primary/30 border-dashed animate-spin-slow" />
            <div className="absolute inset-12 rounded-full border border-accent/20" />
            <img src={logo.url} alt="SK Team" className="relative w-3/4 animate-float drop-shadow-[0_0_40px_var(--primary)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-10 relative">
        <div className="grid md:grid-cols-3 gap-4">
          {[[Zap, "t1", "t1d"], [ShieldCheck, "t2", "t2d"], [Headphones, "t3", "t3d"]].map(([Icon, a, b]: any) => (
            <div key={a} className="glass rounded-2xl p-6 flex gap-4 items-start">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/15 grid place-items-center text-primary"><Icon /></div>
              <div><h3 className="font-bold mb-1">{t(a)}</h3><p className="text-sm text-muted-foreground">{t(b)}</p></div>
            </div>
          ))}
        </div>
      </section>

      <Section title={t("botsTitle")} desc={t("botsDesc")}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{bots.slice(0, 6).map((b) => <BotCard key={b.id} bot={b} />)}</div>
      </Section>

      <Section title={t("servicesTitle")}>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((sv) => (
            <div key={sv.id} className="glass rounded-3xl p-8 hover:border-primary transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center mb-5"><ServiceIcon name={sv.icon} /></div>
              <h3 className="text-xl font-bold mb-3">{fa ? sv.title_fa : sv.title_en}</h3>
              <p className="text-muted-foreground leading-7 text-sm">{fa ? sv.desc_fa : sv.desc_en}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("process")}>
        <div className="grid md:grid-cols-3 gap-6">
          {[[MessageCircle, "p1", "p1d"], [Code2, "p2", "p2d"], [Rocket, "p3", "p3d"]].map(([Icon, a, b]: any, i) => (
            <div key={a} className="relative glass rounded-3xl p-8">
              <span className="absolute top-4 end-6 text-6xl font-black text-primary/10" dir="ltr">0{i + 1}</span>
              <Icon className="text-accent mb-4 h-8 w-8" /><h3 className="font-bold text-lg mb-2">{t(a)}</h3><p className="text-sm text-muted-foreground">{t(b)}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-5xl px-4 mt-24">
        <div className="rounded-[2rem] bg-gradient-primary p-10 md:p-14 text-center text-primary-foreground shadow-glow">
          <h2 className="text-3xl md:text-4xl font-black mb-4">{t("ctaTitle")}</h2>
          <p className="mb-8 opacity-80">{t("ctaDesc")}</p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <a href={s.telegram_support} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{t("order")}</a>
          </Button>
        </div>
      </section>
    </>
  );
}

export function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black mb-3">{title}</h2>
        <div className="mx-auto h-1 w-20 rounded-full bg-gradient-primary" />
        {desc && <p className="text-muted-foreground mt-4">{desc}</p>}
      </div>
      {children}
    </section>
  );
}
