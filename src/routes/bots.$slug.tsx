import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Send, Check } from "lucide-react";
import { botsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { BotCard } from "@/components/site/BotCard";

export const Route = createFileRoute("/bots/$slug")({
  loader: async ({ context: { queryClient }, params }) => {
    const bots = await queryClient.ensureQueryData(botsQuery);
    const bot = bots.find((b) => b.slug === params.slug);
    if (!bot) throw notFound();
    return { title: bot.title_fa, desc: bot.short_fa };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | SK Team` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.desc },
        ]
      : [{ title: "Unavailable | SK Team" }, { name: "robots", content: "noindex" }],
  }),
  component: BotPage,
});

function BotPage() {
  const { slug } = Route.useParams();
  const { lang, t } = useLang();
  const { data } = useSuspenseQuery(botsQuery);
  const bot = data.find((b) => b.slug === slug)!;
  const fa = lang === "fa";
  const features = fa ? bot.features_fa : bot.features_en;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <Link to="/bots" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowRight className="h-4 w-4 ltr:rotate-180" />{t("back")}
      </Link>
      <div className="glass rounded-[2rem] p-8 md:p-12 grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <div className="relative grid place-items-center">
          <div className="absolute inset-8 rounded-full bg-primary/30 blur-3xl" />
          <img src={bot.image_url} alt={fa ? bot.title_fa : bot.title_en} className="relative w-64 animate-float" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gradient mb-4 leading-tight">{fa ? bot.title_fa : bot.title_en}</h1>
          <p className="text-lg text-muted-foreground leading-8 mb-8">{fa ? bot.short_fa : bot.short_en}</p>
          <Button asChild size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
            <a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{t("buy")}</a>
          </Button>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-14 mb-6">{t("features")}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <div key={f} className="glass rounded-2xl p-5 flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0"><Check className="h-4 w-4" /></span>{f}
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-16 mb-6">{t("bots")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.filter((b) => b.slug !== slug && b.published).slice(0, 3).map((b) => <BotCard key={b.id} bot={b} />)}
      </div>
    </div>
  );
}
