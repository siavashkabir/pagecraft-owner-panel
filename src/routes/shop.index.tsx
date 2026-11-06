import { createFileRoute } from "@tanstack/react-router";
import { botsQuery } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { Storefront } from "@/components/site/Storefront";
export const Route = createFileRoute("/shop/")({ head: () => ({ meta: pageMeta("فروشگاه ربات | SK Team", "خرید ربات تلگرام، ادمین هوشمند AI و سلف با اشتراک‌های ۱، ۳، ۶ و ۱۲ ماهه و فیلتر پلتفرم.") }), loader: ({ context }) => context.queryClient.ensureQueryData(botsQuery), component: Storefront });