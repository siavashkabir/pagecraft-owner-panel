import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, BadgeCheck, Send, ShieldCheck } from "lucide-react";
import { botsQuery } from "@/lib/content";
import { months, planPrice, platforms, type Months } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { BotCard } from "./BotCard";

export function ProductDetail({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(botsQuery); const { lang } = useLang(); const fa = lang === "fa";
  const [month, setMonth] = useState<Months>(1);
  const bot = data.find(b => b.slug === slug && b.published);
  if (!bot) return null;
  const price = planPrice(bot, month); const platform = platforms.find(p => p.id === bot.platform);
  const title = fa ? bot.title_fa : bot.title_en;
  return <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pb-0">
    <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-8"><ArrowRight className="h-4 w-4 ltr:rotate-180"/>{fa ? "فروشگاه" : "Store"}</Link>
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10"><div><div className="bg-secondary/40 rounded-lg aspect-[4/3] grid place-items-center mb-8"><img src={bot.image_url} alt={title} className="w-64 h-64 max-w-[75%] object-contain"/></div><span className="text-accent text-sm">{fa ? platform?.fa : platform?.en}</span><h1 className="text-3xl md:text-4xl font-black mt-3 mb-5 leading-snug">{title}</h1><p className="text-muted-foreground leading-8">{fa ? bot.short_fa : bot.short_en}</p></div>
    <aside className="lg:sticky lg:top-24 self-start border border-border rounded-lg bg-card p-6"><div className="flex items-center gap-3 border-b border-border pb-5 mb-6"><BadgeCheck className="text-accent"/><div><span className="text-xs text-muted-foreground">{fa ? "توسعه‌دهنده" : "Developer"}</span><p className="font-bold" dir="ltr">SK Team</p></div></div><h2 className="font-bold mb-4">{fa ? "مدت اشتراک" : "Subscription duration"}</h2><div className="grid grid-cols-2 gap-2">{months.map(m => <Button key={m} variant={month === m ? "default" : "outline"} aria-pressed={month === m} onClick={() => setMonth(m)}>{m.toLocaleString(lang)} {fa ? "ماهه" : "months"}</Button>)}</div><div aria-live="polite" className="py-7"><p className="text-sm text-muted-foreground mb-2">{fa ? "قیمت کل اشتراک" : "Total subscription price"}</p><p className="text-2xl font-bold">{price ? `${price.toLocaleString(lang)} ${fa ? "تومان" : "toman"}` : (fa ? "در انتظار تعیین قیمت" : "Pricing pending")}</p></div><Button disabled className="w-full" size="lg">{fa ? "پرداخت آنلاین هنوز فعال نیست" : "Online payment not available yet"}</Button>{bot.link && <Button asChild variant="outline" className="w-full mt-3"><a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4"/>{fa ? "استعلام و سفارش" : "Enquire & order"}</a></Button>}<p className="mt-5 text-xs leading-6 text-muted-foreground flex gap-2"><ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-1"/>{fa ? "اعتبار اشتراک از زمان فعال‌سازی محاسبه می‌شود؛ شرایط نصب و تحویل پیش از پرداخت تأیید می‌شود." : "Subscription starts on activation. Installation and delivery terms are confirmed before payment."}</p></aside></div>
    <section className="mt-12"><h2 className="text-2xl font-bold mb-5">{fa ? "قابلیت‌ها" : "Features"}</h2><div className="grid md:grid-cols-2 gap-x-8">{(fa ? bot.features_fa : bot.features_en).map(f => <div key={f} className="flex items-start gap-3 border-b border-border py-4 leading-7"><Check className="h-5 w-5 text-accent mt-1 shrink-0"/>{f}</div>)}</div></section>
    <section className="mt-12"><h2 className="text-2xl font-bold mb-6">{fa ? "محصولات همین پلتفرم" : "Same platform"}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{data.filter(b => b.published && b.platform === bot.platform && b.id !== bot.id).slice(0,3).map(b => <BotCard key={b.id} bot={b}/>)}</div></section>
    <div className="fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border p-3 md:hidden flex items-center justify-between gap-3"><p className="font-bold text-sm">{price ? `${price.toLocaleString(lang)} ${fa ? "تومان" : "toman"}` : (fa ? "قیمت تعیین نشده" : "Pricing pending")}</p><Button asChild size="sm"><a href={bot.link} target="_blank" rel="noreferrer">{fa ? "استعلام سفارش" : "Enquire"}</a></Button></div>
  </div>;
}