import { createFileRoute } from "@tanstack/react-router";
import { ProjectService } from "@/components/site/ProjectService";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/services_/custom-bot")({ head: () => ({ meta: pageMeta("ساخت ربات سفارشی | SK Team", "ثبت ایده ساخت ربات سفارشی تلگرام، بله، ایتا و روبیکا؛ مشاوره، برآورد، ساخت و تحویل.") }), component: Page });
function Page() { return <ProjectService kind="bot"/>; }