import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bot, Globe, MessagesSquare, Sparkles, ShoppingCart, Cpu, Send } from "lucide-react";
import { servicesQuery, settingsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { PageHero } from "./about";

const icons = { Bot, Globe, MessagesSquare, Sparkles, ShoppingCart, Cpu } as const;
export const serviceIconNames = Object.keys(icons);
export function ServiceIcon({ name }: { name: string }) {
  const I = icons[name as keyof typeof icons] ?? Sparkles;
  return <I className="h-7 w-7" />;
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدمات | SK Team" },
      { name: "description", content: "ساخت ربات پیام‌رسان، طراحی وب‌سایت و مدیریت شبکه‌های اجتماعی." },
      { property: "og:title", content: "خدمات SK Team" },
      { property: "og:description", content: "ساخت ربات، طراحی سایت و مدیریت شبکه‌های اجتماعی." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context: { queryClient } }) => Promise.all([queryClient.ensureQueryData(servicesQuery), queryClient.ensureQueryData(settingsQuery)]),
  component: Services,
});

function Services() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(servicesQuery);
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <>
      <PageHero title={t("servicesTitle")} />
      <div className="mx-auto max-w-5xl px-4 space-y-6">
        <div className="grid md:grid-cols-2 gap-5 pb-8 border-b border-border">
          <div className="border border-border rounded-lg p-6 bg-card"><Bot className="text-accent mb-4"/><h2 className="text-2xl font-bold mb-3">{lang === "fa" ? "ساخت ربات سفارشی" : "Custom bot development"}</h2><p className="text-muted-foreground mb-5">{lang === "fa" ? "ایده، مشاوره و برآورد، ساخت و تحویل" : "Idea, estimate, development and delivery"}</p><Button asChild><Link to="/services/custom-bot">{lang === "fa" ? "ثبت ایده پروژه" : "Submit your idea"}</Link></Button></div>
          <div className="border border-border rounded-lg p-6 bg-card"><Globe className="text-accent mb-4"/><h2 className="text-2xl font-bold mb-3">{lang === "fa" ? "طراحی سایت اختصاصی" : "Custom website design"}</h2><p className="text-muted-foreground mb-5">{lang === "fa" ? "شرکتی، فروشگاهی، لندینگ و پورتفولیو" : "Corporate, e-commerce, landing and portfolio"}</p><Button asChild><Link to="/services/web-design">{lang === "fa" ? "انتخاب طرح و درخواست" : "Choose a design"}</Link></Button></div>
        </div>
        {data.map((sv, i) => (
          <div key={sv.id} className="glass rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center"><ServiceIcon name={sv.icon} /></div>
            <div className="flex-1">
              <span className="text-xs text-accent" dir="ltr">0{i + 1}</span>
              <h2 className="text-2xl font-bold mb-2">{lang === "fa" ? sv.title_fa : sv.title_en}</h2>
              <p className="text-muted-foreground leading-8">{lang === "fa" ? sv.desc_fa : sv.desc_en}</p>
            </div>
            <Button asChild variant="outline" className="rounded-full self-center">
              <a href={s.telegram_support} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{t("order")}</a>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
