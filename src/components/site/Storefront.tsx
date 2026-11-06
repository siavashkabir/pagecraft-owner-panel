import { useState } from "react";
import { Search, SlidersHorizontal, PackageOpen } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { botsQuery } from "@/lib/content";
import { platforms, categories, filterProducts } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotCard } from "./BotCard";

export function Storefront() {
  const { data } = useSuspenseQuery(botsQuery);
  const { lang } = useLang(); const fa = lang === "fa";
  const [platform, setPlatform] = useState("all"); const [category, setCategory] = useState("all"); const [search, setSearch] = useState("");
  const products = filterProducts(data, platform, category, search);
  return <div className="mx-auto max-w-7xl px-4 pt-12">
    <div className="flex items-end justify-between gap-6 flex-wrap pb-8 border-b border-border"><div><p className="text-accent text-sm mb-3" dir="ltr">SK.TEAM / STORE</p><h1 className="text-3xl md:text-5xl font-black mb-4">{fa ? "فروشگاه ربات‌های هوشمند" : "Smart bot store"}</h1><p className="text-muted-foreground">{fa ? "تلگرام، اینستاگرام، بله، ایتا و روبیکا" : "Telegram, Instagram, Bale, Eitaa & Rubika"}</p></div><div className="relative w-full sm:w-72"><Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground"/><Input aria-label={fa ? "جستجوی محصولات" : "Search products"} placeholder={fa ? "جستجوی ربات…" : "Search bots…"} className="ps-10 h-10" value={search} onChange={e => setSearch(e.target.value)}/></div></div>
    <div className="flex flex-wrap gap-2 py-6" aria-label="platform filters"><Button variant={platform === "all" ? "default" : "outline"} onClick={() => setPlatform("all")}>{fa ? "همه پلتفرم‌ها" : "All platforms"}</Button>{platforms.map(p => <Button key={p.id} variant={platform === p.id ? "default" : "outline"} aria-pressed={platform === p.id} onClick={() => setPlatform(p.id)}>{fa ? p.fa : p.en}<span className="text-xs opacity-70">{data.filter(b => b.published && b.platform === p.id).length.toLocaleString(lang)}</span></Button>)}</div>
    <div className="flex flex-wrap items-center gap-2 pb-6"><SlidersHorizontal className="w-4 h-4 text-accent me-2"/><Button size="sm" variant={category === "all" ? "secondary" : "ghost"} onClick={() => setCategory("all")}>{fa ? "همه دسته‌ها" : "All categories"}</Button>{categories.map(c => <Button key={c.id} size="sm" variant={category === c.id ? "secondary" : "ghost"} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{fa ? c.fa : c.en}</Button>)}</div>
    <p className="text-sm text-muted-foreground mb-5">{products.length.toLocaleString(lang)} {fa ? "محصول" : "products"}</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{products.map(bot => <BotCard key={bot.id} bot={bot}/>)}</div>
    {!products.length && <div className="text-center py-20"><PackageOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4"/><h2 className="font-bold text-xl mb-3">{fa ? "محصولی پیدا نشد" : "No products found"}</h2><p className="text-muted-foreground mb-5">{fa ? "در این پلتفرم یا دسته هنوز محصولی منتشر نشده است." : "No published products in this selection yet."}</p><Button variant="outline" onClick={() => { setPlatform("all"); setCategory("all"); setSearch(""); }}>{fa ? "پاک کردن فیلترها" : "Clear filters"}</Button></div>}
  </div>;
}