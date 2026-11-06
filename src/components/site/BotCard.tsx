import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Bot } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { platforms, categories, startingPrice } from "@/lib/store";

export function BotCard({ bot }: { bot: Bot }) {
  const { lang, t } = useLang();
  const fa = lang === "fa";
  const price = startingPrice(bot);
  const platform = platforms.find(p => p.id === bot.platform);
  const category = categories.find(c => c.id === bot.category);
  return (
    <Link to="/shop/$id" params={{ id: bot.slug }}
      className="group bg-card border border-border rounded-lg p-6 flex flex-col gap-4 hover:-translate-y-1 hover:border-primary transition-all motion-reduce:transform-none">
      <div className="flex justify-between text-xs gap-2"><span className="text-accent">{fa ? platform?.fa : platform?.en}</span><span className="text-muted-foreground">{fa ? category?.fa : category?.en}</span></div>
      <div className="relative h-36 grid place-items-center">
        <img src={bot.image_url} alt={lang === "fa" ? bot.title_fa : bot.title_en} className="relative h-32 w-32 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
      </div>
      <h3 className="text-xl font-bold">{lang === "fa" ? bot.title_fa : bot.title_en}</h3>
      <p className="text-sm text-muted-foreground leading-7 flex-1">{lang === "fa" ? bot.short_fa : bot.short_en}</p>
      <div className="border-t border-border pt-4 flex items-end justify-between gap-3"><div><span className="block text-xs text-muted-foreground mb-1">{price ? (fa ? "شروع از" : "From") : (fa ? "قیمت" : "Price")}</span><span className="font-bold">{price ? `${price.toLocaleString(lang)} ${fa ? "تومان" : "toman"}` : (fa ? "در انتظار تعیین قیمت" : "Pricing pending")}</span></div><ArrowLeft className="h-5 w-5 text-primary ltr:rotate-180 shrink-0"/></div>
    </Link>
  );
}
