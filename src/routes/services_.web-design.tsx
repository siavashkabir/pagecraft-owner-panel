import { createFileRoute } from "@tanstack/react-router";
import { ProjectService } from "@/components/site/ProjectService";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/services_/web-design")({ head: () => ({ meta: pageMeta("طراحی سایت اختصاصی | SK Team", "طراحی سایت شرکتی، فروشگاهی، لندینگ و پورتفولیو با سبک‌های مینیمال، دارک نئون، گلس و کلاسیک.") }), component: Page });
function Page() { return <ProjectService kind="website"/>; }