import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, BadgeCheck, Send, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { botsQuery } from "@/lib/content";
import { months, planPrice, platforms, type Months } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BotCard } from "./BotCard";

export function ProductDetail({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(botsQuery);
  const { lang } = useLang();
  const fa = lang === "fa";
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState<Months>(1);
  const [busy, setBusy] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const bot = data.find((item) => item.slug === slug && item.published);
  if (!bot) return null;
  const price = planPrice(bot, month);
  const platform = platforms.find((item) => item.id === bot.platform);
  const title = fa ? bot.title_fa : bot.title_en;

  const placeOrder = async () => {
    if (price == null) return;
    setBusy(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) {
        nav({ to: "/auth", search: { redirect: `/shop/${bot.slug}` } });
        return;
      }
      const userId = authData.user.id;
      const { data: existing, error: findError } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "subscription")
        .eq("bot_id", bot.id)
        .eq("plan_months", month)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (findError) throw findError;
      if (!existing) {
        const { error } = await supabase.from("orders").insert({
          user_id: userId,
          type: "subscription",
          bot_id: bot.id,
          plan_months: month,
          status: "pending",
        });
        if (error) throw error;
      }
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "orders", userId] });
      setOrderOpen(true);
    } catch {
      toast.error(fa ? "ثبت سفارش انجام نشد؛ دوباره تلاش کنید." : "The order could not be registered. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-24 md:pb-0">
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-8"><ArrowRight className="h-4 w-4 ltr:rotate-180" />{fa ? "فروشگاه" : "Store"}</Link>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
        <div>
          <div className="bg-secondary/40 rounded-lg aspect-[4/3] grid place-items-center mb-8"><img src={bot.image_url} alt={title} className="w-64 h-64 max-w-[75%] object-contain" /></div>
          <span className="text-accent text-sm">{fa ? platform?.fa : platform?.en}</span>
          <h1 className="text-3xl md:text-4xl font-black mt-3 mb-5 leading-snug">{title}</h1>
          <p className="text-muted-foreground leading-8">{fa ? bot.short_fa : bot.short_en}</p>
        </div>
        <aside className="lg:sticky lg:top-24 self-start border border-border rounded-lg bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-5 mb-6"><BadgeCheck className="text-accent" /><div><span className="text-xs text-muted-foreground">{fa ? "توسعه‌دهنده" : "Developer"}</span><p className="font-bold" dir="ltr">SK Team</p></div></div>
          <h2 className="font-bold mb-4">{fa ? "مدت اشتراک" : "Subscription duration"}</h2>
          <div className="grid grid-cols-2 gap-2">{months.map((item) => <Button key={item} variant={month === item ? "default" : "outline"} aria-pressed={month === item} onClick={() => setMonth(item)}>{item.toLocaleString(lang)} {fa ? "ماهه" : "months"}</Button>)}</div>
          {price != null && <div aria-live="polite" className="py-7"><p className="text-sm text-muted-foreground mb-2">{fa ? "قیمت کل اشتراک" : "Total subscription price"}</p><p className="text-2xl font-bold">{price.toLocaleString(lang)} {fa ? "تومان" : "toman"}</p></div>}
          {price != null && <Button onClick={placeOrder} disabled={busy} className="w-full" size="lg"><ShoppingBag className="h-4 w-4" />{busy ? (fa ? "در حال ثبت…" : "Registering…") : (fa ? "ثبت سفارش" : "Place order")}</Button>}
          {bot.link && <Button asChild variant="outline" className="w-full mt-3"><a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{fa ? "استعلام و سفارش" : "Enquire & order"}</a></Button>}
          <p className="mt-5 text-xs leading-6 text-muted-foreground flex gap-2"><ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-1" />{fa ? "اعتبار اشتراک از زمان فعال‌سازی محاسبه می‌شود؛ شرایط نصب و تحویل پیش از پرداخت تأیید می‌شود." : "Subscription starts on activation. Installation and delivery terms are confirmed before payment."}</p>
        </aside>
      </div>
      <section className="mt-12"><h2 className="text-2xl font-bold mb-5">{fa ? "قابلیت‌ها" : "Features"}</h2><div className="grid md:grid-cols-2 gap-x-8">{(fa ? bot.features_fa : bot.features_en).map((feature) => <div key={feature} className="flex items-start gap-3 border-b border-border py-4 leading-7"><Check className="h-5 w-5 text-accent mt-1 shrink-0" />{feature}</div>)}</div></section>
      <section className="mt-12"><h2 className="text-2xl font-bold mb-6">{fa ? "محصولات همین پلتفرم" : "Same platform"}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{data.filter((item) => item.published && item.platform === bot.platform && item.id !== bot.id).slice(0, 3).map((item) => <BotCard key={item.id} bot={item} />)}</div></section>
      <div className="fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border p-3 md:hidden flex items-center justify-between gap-3">
        {price != null ? <><p className="font-bold text-sm">{price.toLocaleString(lang)} {fa ? "تومان" : "toman"}</p><div className="flex items-center gap-2">{bot.link && <Button asChild size="sm" variant="outline" aria-label={fa ? "استعلام و سفارش" : "Enquire and order"}><a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4" /></a></Button>}<Button onClick={placeOrder} disabled={busy} size="sm">{fa ? "ثبت سفارش" : "Place order"}</Button></div></> : bot.link && <Button asChild size="sm" className="w-full"><a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{fa ? "استعلام و سفارش" : "Enquire & order"}</a></Button>}
      </div>
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent dir={fa ? "rtl" : "ltr"}>
          <DialogHeader><DialogTitle>{fa ? "سفارش شما ثبت شد" : "Your order is registered"}</DialogTitle><DialogDescription className="leading-7">{fa ? "سفارش در داشبورد شما ذخیره شد. برای هماهنگی پرداخت و فعال‌سازی با پشتیبانی در تماس باشید." : "The order is saved in your dashboard. Contact support to coordinate payment and activation."}</DialogDescription></DialogHeader>
          <div className="grid gap-3 mt-3">
            {bot.link && <Button asChild className="bg-gradient-primary text-primary-foreground"><a href={bot.link} target="_blank" rel="noreferrer"><Send className="h-4 w-4" />{fa ? "هماهنگی پرداخت در پشتیبانی" : "Coordinate payment with support"}</a></Button>}
            <Button asChild variant="outline"><Link to="/dashboard">{fa ? "مشاهده در داشبورد" : "View in dashboard"}</Link></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
