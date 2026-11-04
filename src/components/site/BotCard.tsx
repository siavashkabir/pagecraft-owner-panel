import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Bot } from "@/lib/content";
import { useLang } from "@/lib/lang";

export function BotCard({ bot }: { bot: Bot }) {
  const { lang, t } = useLang();
  return (
    <Link to="/bots/$slug" params={{ slug: bot.slug }}
      className="group glass rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1.5 hover:border-primary hover:shadow-glow transition-all">
      <div className="relative h-36 grid place-items-center">
        <div className="absolute inset-6 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/35 transition-colors" />
        <img src={bot.image_url} alt={lang === "fa" ? bot.title_fa : bot.title_en} className="relative h-32 w-32 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
      </div>
      <h3 className="text-xl font-bold">{lang === "fa" ? bot.title_fa : bot.title_en}</h3>
      <p className="text-sm text-muted-foreground leading-7 flex-1">{lang === "fa" ? bot.short_fa : bot.short_en}</p>
      <span className="text-sm text-primary flex items-center gap-1">{t("details")}<ArrowLeft className="h-4 w-4 ltr:rotate-180" /></span>
    </Link>
  );
}
