import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fa" | "en";

const dict = {
  fa: {
    home: "خانه", bots: "ربات‌ها", services: "خدمات", about: "درباره ما", contact: "تماس",
    viewBots: "مشاهده ربات‌ها", order: "ثبت سفارش در تلگرام", buy: "مشاهده قیمت و خرید",
    features: "امکانات و قابلیت‌ها", back: "بازگشت", details: "جزئیات",
    t1: "تحویل آنی", t1d: "ربات‌ها بلافاصله پس از خرید فعال می‌شوند.",
    t2: "امنیت بالا", t2d: "محافظت کامل از گروه و اکانت شما.",
    t3: "پشتیبانی ۲۴/۷", t3d: "تیم ما همیشه آماده پاسخگویی است.",
    botsTitle: "ربات‌های هوشمند SK Team", botsDesc: "روی هر ربات کلیک کنید تا توضیحات کامل را ببینید.",
    servicesTitle: "خدمات تخصصی ما", aboutTitle: "درباره SK Team",
    contactTitle: "ارتباط با ما", contactDesc: "پیام خود را بفرستید یا مستقیم در تلگرام با ما در ارتباط باشید.",
    name: "نام", contactField: "شماره یا آیدی تلگرام", message: "پیام", send: "ارسال پیام", sent: "پیام شما ارسال شد.",
    support: "پشتیبانی", channel: "کانال", email: "ایمیل", instagram: "اینستاگرام",
    rights: "تمامی حقوق برای SK Team محفوظ است.", ctaTitle: "ربات اختصاصی خودتان را می‌خواهید؟",
    ctaDesc: "ایده‌تان را بگویید؛ ما آن را به یک ربات یا سایت حرفه‌ای تبدیل می‌کنیم.",
    stat1: "ربات فعال", stat2: "مشتری راضی", stat3: "پشتیبانی", process: "مراحل همکاری",
    p1: "مشاوره", p1d: "نیاز شما را دقیق بررسی می‌کنیم.", p2: "طراحی و ساخت", p2d: "ربات یا سایت شما ساخته می‌شود.",
    p3: "تحویل و پشتیبانی", p3d: "تحویل آنی و پشتیبانی همیشگی.",
  },
  en: {
    home: "Home", bots: "Bots", services: "Services", about: "About", contact: "Contact",
    viewBots: "View Bots", order: "Order on Telegram", buy: "View Price & Buy",
    features: "Features & Capabilities", back: "Back", details: "Details",
    t1: "Instant Delivery", t1d: "Bots activate right after purchase.",
    t2: "High Security", t2d: "Full protection for your group and account.",
    t3: "24/7 Support", t3d: "Our team is always ready to help.",
    botsTitle: "SK Team Smart Bots", botsDesc: "Click any bot to see its full details.",
    servicesTitle: "Our Specialized Services", aboutTitle: "About SK Team",
    contactTitle: "Contact Us", contactDesc: "Send us a message or reach us directly on Telegram.",
    name: "Name", contactField: "Phone or Telegram ID", message: "Message", send: "Send message", sent: "Your message was sent.",
    support: "Support", channel: "Channel", email: "Email", instagram: "Instagram",
    rights: "All rights reserved by SK Team.", ctaTitle: "Want your own custom bot?",
    ctaDesc: "Tell us your idea; we'll turn it into a professional bot or website.",
    stat1: "Active bots", stat2: "Happy clients", stat3: "Support", process: "How we work",
    p1: "Consult", p1d: "We study your needs carefully.", p2: "Design & Build", p2d: "Your bot or site gets built.",
    p3: "Deliver & Support", p3d: "Instant delivery and ongoing support.",
  },
} as const;

type Key = keyof (typeof dict)["fa"];
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "fa", setLang: () => {}, t: (k) => dict.fa[k],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa");
  useEffect(() => {
    const s = localStorage.getItem("lang");
    if (s === "en" || s === "fa") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => { localStorage.setItem("lang", l); setLangState(l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
