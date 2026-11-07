import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Eye, EyeOff, ExternalLink, KeyRound, LogOut, PackageOpen, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { remainingDays } from "@/lib/dashboard";
import { useLang } from "@/lib/lang";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "داشبورد مشتری | SK Team" },
      { name: "description", content: "مشاهده سفارش‌ها، اشتراک‌ها، لایسنس‌ها و پروفایل مشتری SK Team" },
      { property: "og:title", content: "داشبورد مشتری SK Team" },
      { property: "og:description", content: "مدیریت سفارش‌ها و اشتراک‌های SK Team" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type BotTitle = { title_fa: string; title_en: string } | null;
type LicenseWithBot = Tables<"licenses"> & { bots: BotTitle };
type OrderWithBot = Tables<"orders"> & { bots: BotTitle };
type OrderStatus = Tables<"orders">["status"];

const orderSteps: OrderStatus[] = ["pending", "paid", "reviewing", "building", "delivered"];

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { lang } = useLang();
  const fa = lang === "fa";
  const licensesQuery = useQuery({
    queryKey: ["dashboard", "licenses", user.id],
    queryFn: async (): Promise<LicenseWithBot[]> => {
      const { data, error } = await supabase.from("licenses").select("*, bots(title_fa,title_en)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const ordersQuery = useQuery({
    queryKey: ["dashboard", "orders", user.id],
    queryFn: async (): Promise<OrderWithBot[]> => {
      const { data, error } = await supabase.from("orders").select("*, bots(title_fa,title_en)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const activeLicenses = (licensesQuery.data ?? []).filter((license) => license.status === "active" && remainingDays(license.expires_at) > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-accent text-sm mb-2" dir="ltr">SK.TEAM / ACCOUNT</p>
        <h1 className="text-3xl md:text-4xl font-black mb-3">{fa ? "داشبورد من" : "My dashboard"}</h1>
        <p className="text-muted-foreground" dir="ltr">{user.email}</p>
      </div>
      <dl className="grid sm:grid-cols-3 gap-4 mb-8">
        <Summary label={fa ? "اشتراک‌های فعال" : "Active subscriptions"} value={activeLicenses.toLocaleString(lang)} />
        <Summary label={fa ? "همه سفارش‌ها" : "All orders"} value={(ordersQuery.data?.length ?? 0).toLocaleString(lang)} />
        <Summary label={fa ? "وضعیت حساب" : "Account status"} value={fa ? "فعال" : "Active"} />
      </dl>
      <Tabs defaultValue="licenses" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 h-11">
          <TabsTrigger value="licenses">{fa ? "اشتراک‌ها" : "Subscriptions"}</TabsTrigger>
          <TabsTrigger value="orders">{fa ? "سفارش‌ها" : "Orders"}</TabsTrigger>
          <TabsTrigger value="profile">{fa ? "پروفایل" : "Profile"}</TabsTrigger>
        </TabsList>
        <TabsContent value="licenses" className="mt-6">
          {licensesQuery.isLoading ? <DashboardSkeleton /> : licensesQuery.error ? <QueryError fa={fa} /> : licensesQuery.data?.length ? <div className="grid gap-4">{licensesQuery.data.map((license) => <LicenseCard key={license.id} license={license} fa={fa} lang={lang} />)}</div> : <EmptyState fa={fa} kind="licenses" />}
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          {ordersQuery.isLoading ? <DashboardSkeleton /> : ordersQuery.error ? <QueryError fa={fa} /> : ordersQuery.data?.length ? <div className="grid gap-4">{ordersQuery.data.map((order) => <OrderCard key={order.id} order={order} fa={fa} lang={lang} />)}</div> : <EmptyState fa={fa} kind="orders" />}
        </TabsContent>
        <TabsContent value="profile" className="mt-6"><ProfilePanel fa={fa} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="glass rounded-2xl p-5"><dt className="text-sm text-muted-foreground mb-2">{label}</dt><dd className="text-2xl font-black">{value}</dd></div>;
}

function DashboardSkeleton() {
  return <div className="grid gap-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>;
}

function QueryError({ fa }: { fa: boolean }) {
  return <div role="alert" className="border border-border rounded-2xl p-8 text-center"><p className="font-bold mb-2">{fa ? "اطلاعات دریافت نشد" : "Information unavailable"}</p><p className="text-sm text-muted-foreground">{fa ? "اتصال را بررسی کنید و صفحه را دوباره بارگذاری کنید." : "Check your connection and reload the page."}</p></div>;
}

function EmptyState({ fa, kind }: { fa: boolean; kind: "licenses" | "orders" }) {
  return <div className="glass rounded-2xl py-14 px-6 text-center"><PackageOpen className="h-12 w-12 text-accent mx-auto mb-5" /><h2 className="text-xl font-bold mb-3">{kind === "licenses" ? (fa ? "اشتراکی برای این حساب ثبت نشده" : "No subscriptions on this account") : (fa ? "سفارشی برای این حساب ثبت نشده" : "No orders on this account")}</h2><p className="text-muted-foreground mb-6">{fa ? "از فروشگاه، اشتراک یا خدمت متناسب با نیاز خود را انتخاب کنید." : "Choose a subscription or service from the store."}</p><Button asChild><Link to="/shop"><ShoppingBag className="h-4 w-4" />{fa ? "مشاهده فروشگاه" : "Browse the store"}</Link></Button></div>;
}

function LicenseCard({ license, fa, lang }: { license: LicenseWithBot; fa: boolean; lang: "fa" | "en" }) {
  const [visible, setVisible] = useState(false);
  const days = remainingDays(license.expires_at);
  const expired = days === 0 || license.status !== "active";
  const title = license.bots ? (fa ? license.bots.title_fa : license.bots.title_en) : (fa ? "اشتراک SK Team" : "SK Team subscription");
  const status = license.status === "revoked" ? (fa ? "لغو شده" : "Revoked") : expired ? (fa ? "منقضی شده" : "Expired") : (fa ? "فعال" : "Active");
  const copy = async () => {
    await navigator.clipboard.writeText(license.license_key);
    toast.success(fa ? "کد فعال‌سازی کپی شد" : "Activation code copied");
  };
  return (
    <article className="glass rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div><h2 className="text-xl font-bold mb-2">{title}</h2><p className="text-sm text-muted-foreground">{license.plan_months.toLocaleString(lang)} {fa ? "ماهه" : "months"} · {fa ? "انقضا" : "Expires"}: {new Date(license.expires_at).toLocaleDateString(fa ? "fa-IR" : "en")}</p></div>
        <Badge variant={expired ? "secondary" : "default"}>{status}</Badge>
      </div>
      {!expired && <p className="text-sm text-accent mb-5">{days.toLocaleString(lang)} {fa ? "روز باقی مانده" : "days remaining"}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t border-border pt-5">
        <code dir="ltr" className="flex-1 rounded-lg bg-muted px-4 py-3 text-sm overflow-hidden text-ellipsis">{visible ? license.license_key : "SK-••••••••••••••••"}</code>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setVisible(!visible)} aria-label={visible ? (fa ? "پنهان کردن کد" : "Hide code") : (fa ? "نمایش کد" : "Show code")}>{visible ? <EyeOff /> : <Eye />}</Button>
          <Button variant="outline" size="icon" onClick={copy} aria-label={fa ? "کپی کد" : "Copy code"}><Copy /></Button>
          {license.install_url && <Button asChild variant="outline"><a href={license.install_url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />{fa ? "نصب" : "Install"}</a></Button>}
        </div>
      </div>
    </article>
  );
}

function OrderCard({ order, fa, lang }: { order: OrderWithBot; fa: boolean; lang: "fa" | "en" }) {
  const typeLabels = { subscription: fa ? "اشتراک" : "Subscription", custom_bot: fa ? "ربات اختصاصی" : "Custom bot", custom_site: fa ? "طراحی سایت" : "Website design" };
  const statusLabels: Record<OrderStatus, string> = { pending: fa ? "در انتظار پرداخت" : "Pending", paid: fa ? "پرداخت شده" : "Paid", reviewing: fa ? "بررسی و برآورد" : "Reviewing", building: fa ? "در حال ساخت" : "Building", delivered: fa ? "تحویل شده" : "Delivered", cancelled: fa ? "لغو شده" : "Cancelled" };
  const title = order.bots ? (fa ? order.bots.title_fa : order.bots.title_en) : typeLabels[order.type];
  return (
    <article className="glass rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div><div className="flex items-center gap-2 mb-2"><Badge variant="outline">{typeLabels[order.type]}</Badge>{order.plan_months && <span className="text-xs text-muted-foreground">{order.plan_months.toLocaleString(lang)} {fa ? "ماهه" : "months"}</span>}</div><h2 className="text-xl font-bold">{title}</h2><p className="text-sm text-muted-foreground mt-2">{new Date(order.created_at).toLocaleDateString(fa ? "fa-IR" : "en")}</p></div>
        {order.status === "cancelled" && <Badge variant="destructive">{statusLabels.cancelled}</Badge>}
      </div>
      {order.status === "cancelled" ? <p className="text-sm text-muted-foreground">{fa ? "این سفارش لغو شده است." : "This order was cancelled."}</p> : <ol className="grid grid-cols-5 gap-1" aria-label={statusLabels[order.status]}>{orderSteps.map((step, index) => { const current = orderSteps.indexOf(order.status); const reached = index <= current; return <li key={step} className="text-center"><span className={`mx-auto mb-2 h-7 w-7 rounded-full grid place-items-center text-xs ${reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index < current ? <Check className="h-4 w-4" /> : (index + 1).toLocaleString(lang)}</span><span className={`text-[10px] sm:text-xs leading-5 block ${reached ? "text-foreground" : "text-muted-foreground"}`}>{statusLabels[step]}</span></li>; })}</ol>}
    </article>
  );
}

function ProfilePanel({ fa }: { fa: boolean }) {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [name, setName] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const displayName = name ?? profileQuery.data?.display_name ?? "";

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(fa ? "ذخیره نام انجام نشد." : "Your name could not be saved."); return; }
    toast.success(fa ? "پروفایل ذخیره شد" : "Profile saved");
    queryClient.invalidateQueries({ queryKey: ["dashboard", "profile", user.id] });
  };
  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword, current_password: currentPassword });
    setSaving(false);
    if (error) { toast.error(fa ? "رمز تغییر نکرد؛ رمز فعلی را بررسی کنید." : "Password unchanged; check your current password."); return; }
    setCurrentPassword(""); setNewPassword("");
    toast.success(fa ? "رمز عبور تغییر کرد" : "Password updated");
  };
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <form onSubmit={saveProfile} className="glass rounded-2xl p-6 grid gap-4 content-start">
        <h2 className="text-xl font-bold mb-2">{fa ? "مشخصات حساب" : "Account details"}</h2>
        <div className="space-y-2"><Label htmlFor="profile-name">{fa ? "نام نمایشی" : "Display name"}</Label><Input id="profile-name" maxLength={100} value={displayName} onChange={(event) => setName(event.target.value)} placeholder={profileQuery.isLoading ? "…" : ""} /></div>
        <div className="space-y-2"><Label htmlFor="profile-email">{fa ? "ایمیل" : "Email"}</Label><Input id="profile-email" dir="ltr" value={user.email ?? ""} disabled /></div>
        <Button disabled={saving || profileQuery.isLoading} className="justify-self-start">{fa ? "ذخیره پروفایل" : "Save profile"}</Button>
      </form>
      <form onSubmit={changePassword} className="glass rounded-2xl p-6 grid gap-4 content-start">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><KeyRound className="h-5 w-5 text-accent" />{fa ? "تغییر رمز عبور" : "Change password"}</h2>
        <div className="space-y-2"><Label htmlFor="current-password">{fa ? "رمز فعلی" : "Current password"}</Label><Input id="current-password" type="password" required dir="ltr" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="new-password">{fa ? "رمز جدید" : "New password"}</Label><Input id="new-password" type="password" required minLength={8} dir="ltr" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></div>
        <Button disabled={saving} variant="outline" className="justify-self-start">{fa ? "تغییر رمز" : "Update password"}</Button>
      </form>
      <div className="lg:col-span-2 border-t border-border pt-5"><Button variant="ghost" onClick={signOut} className="text-destructive"><LogOut className="h-4 w-4" />{fa ? "خروج از حساب" : "Sign out"}</Button></div>
    </div>
  );
}
