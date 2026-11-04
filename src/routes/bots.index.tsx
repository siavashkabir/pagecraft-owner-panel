import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { botsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { BotCard } from "@/components/site/BotCard";
import { PageHero } from "./about";

export const Route = createFileRoute("/bots/")({
  head: () => ({
    meta: [
      { title: "ربات‌ها | SK Team" },
      { name: "description", content: "موزیک پلیر، ویدیو پلیر، مدیریت گروه، ریکوردر ویس‌کال، گارد محتوا و ربات سلف." },
      { property: "og:title", content: "ربات‌های هوشمند SK Team" },
      { property: "og:description", content: "همه ربات‌های تلگرامی SK Team در یک جا." },
    ],
  }),
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(botsQuery),
  component: Bots,
});

function Bots() {
  const { t } = useLang();
  const { data } = useSuspenseQuery(botsQuery);
  return (
    <>
      <PageHero title={t("botsTitle")} desc={t("botsDesc")} />
      <div className="mx-auto max-w-7xl px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.filter((b) => b.published).map((b) => <BotCard key={b.id} bot={b} />)}
      </div>
    </>
  );
}
