import { createFileRoute, notFound } from "@tanstack/react-router";
import { botsQuery } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { ProductDetail } from "@/components/site/ProductDetail";
export const Route = createFileRoute("/shop/$id")({ loader: async ({ context, params }) => { const bots = await context.queryClient.ensureQueryData(botsQuery); const bot = bots.find(b => b.slug === params.id && b.published); if (!bot) throw notFound(); return { title: bot.title_fa, desc: bot.short_fa, image: bot.image_url }; }, head: ({ loaderData }) => ({ meta: loaderData ? pageMeta(`${loaderData.title} | فروشگاه SK Team`, loaderData.desc, loaderData.image) : [...pageMeta("محصول یافت نشد | SK Team", "محصول در دسترس نیست."), { name: "robots", content: "noindex" }] }), component: Page });
function Page() { const { id } = Route.useParams(); return <ProductDetail slug={id}/>; }