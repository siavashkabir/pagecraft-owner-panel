import { z } from "zod";
import type { Bot } from "./content";

export const platforms = [{ id: "telegram", fa: "تلگرام", en: "Telegram" }, { id: "instagram", fa: "اینستاگرام", en: "Instagram" }, { id: "bale", fa: "بله", en: "Bale" }, { id: "eitaa", fa: "ایتا", en: "Eitaa" }, { id: "rubika", fa: "روبیکا", en: "Rubika" }] as const;
export const categories = [{ id: "group", fa: "مدیریت گروه", en: "Group management" }, { id: "account", fa: "مدیریت اکانت", en: "Account management" }, { id: "ai", fa: "هوش مصنوعی", en: "AI" }, { id: "business", fa: "کسب‌وکار", en: "Business" }, { id: "tools", fa: "ابزار و گزارش", en: "Tools & reports" }] as const;
export const months = [1, 3, 6, 12] as const;
export type Months = (typeof months)[number];
export function planPrice(bot: Bot, month: Months): number | null { return bot[`price_${month}`]; }
export function filterProducts(bots: Bot[], platform: string, category: string, search = "") {
  const term = search.trim().toLowerCase();
  return bots.filter(b => b.published && (platform === "all" || b.platform === platform) && (category === "all" || b.category === category) && `${b.title_fa} ${b.title_en} ${b.short_fa} ${b.short_en}`.toLowerCase().includes(term));
}
export function startingPrice(bot: Bot) { const prices = months.map(m => planPrice(bot, m)).filter((p): p is number => p !== null && p > 0); return prices.length ? Math.min(...prices) : null; }
export const projectSchema = z.object({ name: z.string().trim().min(1).max(100), contact: z.string().trim().min(1).max(200), kind: z.enum(["bot", "website"]), platform: z.enum(["telegram", "instagram", "bale", "eitaa", "rubika"]), model: z.enum(["corporate", "store", "landing", "portfolio"]), style: z.enum(["minimal", "neon", "glass", "classic", "3d", "retro"]), budget: z.string().trim().max(100), idea: z.string().trim().min(1).max(2000) });
export const models = [{ id: "corporate", fa: "شرکتی", en: "Corporate" }, { id: "store", fa: "فروشگاهی", en: "E-commerce" }, { id: "landing", fa: "لندینگ", en: "Landing page" }, { id: "portfolio", fa: "پورتفولیو", en: "Portfolio" }] as const;
export const styles = [{ id: "minimal", fa: "مینیمال", en: "Minimal" }, { id: "neon", fa: "دارک نئون", en: "Dark neon" }, { id: "glass", fa: "گلس‌مورفیسم", en: "Glass" }, { id: "classic", fa: "کلاسیک", en: "Classic" }, { id: "3d", fa: "سه‌بعدی", en: "3D" }, { id: "retro", fa: "رترو", en: "Retro" }] as const;