import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { settingsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره ما | SK Team" },
      { name: "description", content: "آشنایی با تیم SK Team، برنامه‌نویسان متخصص ربات‌های هوشمند." },
      { property: "og:title", content: "درباره SK Team" },
      { property: "og:description", content: "تیمی از برنامه‌نویسان خلاق برای رشد کسب‌وکار شما." },
    ],
  }),
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(settingsQuery),
  component: About,
});

export function PageHero({ title, desc }: { title: string; desc?: string }) {
  return (
    <section className="grid-bg py-20 text-center px-4 mb-12">
      <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">{title}</h1>
      {desc && <p className="text-muted-foreground max-w-2xl mx-auto">{desc}</p>}
    </section>
  );
}

function About() {
  const { t, lang } = useLang();
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <>
      <PageHero title={t("aboutTitle")} />
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1fr_1.4fr] gap-12 items-center">
        <div className="relative grid place-items-center">
          <div className="absolute inset-10 rounded-full bg-primary/25 blur-3xl" />
          <img src={logo.url} alt="SK Team" className="relative w-72 animate-float" />
        </div>
        <div className="glass rounded-3xl p-8 md:p-10">
          <p className="text-lg leading-9 whitespace-pre-line">{lang === "fa" ? s.about_fa : s.about_en}</p>
        </div>
      </div>
    </>
  );
}
