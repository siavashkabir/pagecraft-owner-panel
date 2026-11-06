import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot as BotIcon, Settings, Layers, Inbox, LogOut, ExternalLink, Plus, Trash2, Pencil, Upload } from "lucide-react";
import logo from "@/assets/skteam_ring_transparent.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { adminBotsQuery, servicesQuery, settingsQuery, type Bot, type Service, type General } from "@/lib/content";
import { platforms, categories, months } from "@/lib/store";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { serviceIconNames, ServiceIcon } from "./services";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت | SK Team" },
      { name: "description", content: "پنل مدیریت محتوای سایت SK Team" },
      { property: "og:title", content: "پنل مدیریت SK Team" },
      { property: "og:description", content: "ویرایش محتوای سایت" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Tab = "general" | "bots" | "services" | "messages";

function Admin() {
  const nav = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<Tab>("bots");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { nav({ to: "/auth" }); return; }
      setEmail(user.email ?? "");
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setState(data ? "ok" : "denied");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_OUT") nav({ to: "/auth" }); });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  if (state === "loading") return <div className="min-h-screen grid place-items-center text-muted-foreground">...</div>;
  if (state === "denied")
    return (
      <div dir="rtl" className="min-h-screen grid place-items-center text-center px-4">
        <div><p className="mb-4">این حساب دسترسی مدیریت ندارد.</p><Button onClick={() => supabase.auth.signOut()}>خروج</Button></div>
      </div>
    );

  const tabs: [Tab, string, typeof BotIcon][] = [["bots", "ربات‌ها", BotIcon], ["services", "خدمات", Layers], ["general", "تنظیمات و متن‌ها", Settings], ["messages", "پیام‌ها", Inbox]];
  return (
    <div dir="rtl" className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen bg-sidebar border-e border-sidebar-border p-4 flex md:flex-col gap-2 overflow-x-auto">
        <div className="hidden md:flex items-center gap-2 mb-6 px-2">
          <img src={logo.url} alt="" className="h-10" /><span className="font-black">پنل مدیریت</span>
        </div>
        {tabs.map(([k, l, I]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-colors ${tab === k ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-sidebar-accent"}`}>
            <I className="h-4 w-4" />{l}
          </button>
        ))}
        <div className="md:mt-auto flex md:flex-col gap-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent whitespace-nowrap"><ExternalLink className="h-4 w-4" />مشاهده سایت</Link>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-sidebar-accent whitespace-nowrap"><LogOut className="h-4 w-4" />خروج</button>
          <p className="hidden md:block text-xs text-muted-foreground px-4 truncate" dir="ltr">{email}</p>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-5xl">
        {tab === "bots" && <BotsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "general" && <GeneralTab />}
        {tab === "messages" && <MessagesTab />}
      </main>
    </div>
  );
}

async function uploadImage(file: File) {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  // Bucket is private (workspace blocks public buckets); a long-lived signed link serves the logo.
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2) throw e2;
  return data.signedUrl;
}

function Head({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-black">{title}</h1>{action}</div>;
}

function BotsTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(adminBotsQuery);
  const [edit, setEdit] = useState<Partial<Bot> | null>(null);
  const del = async (b: Bot) => {
    if (!confirm(`حذف «${b.title_fa}»؟`)) return;
    const { error } = await supabase.from("bots").delete().eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["bots"] });
  };
  return (
    <>
      <Head title="ربات‌ها" action={<Button onClick={() => setEdit({ features_fa: [], features_en: [], published: true, platform: "telegram", category: "tools", sort_order: data.length + 1, link: "https://t.me/Siavashska" })}><Plus className="h-4 w-4" />ربات جدید</Button>} />
      <div className="grid gap-3">
        {data.map((b) => (
          <div key={b.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <img src={b.image_url} alt="" className="h-14 w-14 object-contain" />
            <div className="flex-1 min-w-0">
              <div className="font-bold">{b.title_fa} <span className="text-xs text-muted-foreground">/ {b.title_en}</span></div>
              <div className="text-xs text-muted-foreground truncate">{b.short_fa}</div>
            </div>
            {!b.published && <span className="text-xs rounded-full bg-muted px-2 py-1">پیش‌نویس</span>}
            <Button size="icon" variant="ghost" onClick={() => setEdit(b)} aria-label="ویرایش"><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => del(b)} aria-label="حذف"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
      {edit && <BotDialog bot={edit} onClose={() => setEdit(null)} />}
    </>
  );
}

function BotDialog({ bot, onClose }: { bot: Partial<Bot>; onClose: () => void }) {
  const qc = useQueryClient();
  const [b, setB] = useState(bot);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Bot, v: unknown) => setB({ ...b, [k]: v });
  const save = async () => {
    if (!b.slug || !b.title_fa) { toast.error("نامک و عنوان فارسی الزامی است"); return; }
    if (months.some(m => { const price = b[`price_${m}`]; return price != null && (!Number.isSafeInteger(price) || price <= 0); })) { toast.error("قیمت باید عدد صحیح مثبت به تومان باشد"); return; }
    setBusy(true);
    const { id, created_at, ...rest } = b as Bot;
    const res = id ? await supabase.from("bots").update(rest).eq("id", id) : await supabase.from("bots").insert(rest as Bot);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("ذخیره شد");
    qc.invalidateQueries({ queryKey: ["bots"] });
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{b.id ? "ویرایش ربات" : "ربات جدید"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            {b.image_url && <img src={b.image_url} alt="" className="h-20 w-20 object-contain glass rounded-xl" />}
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm glass rounded-xl px-4 py-2 hover:border-primary">
              <Upload className="h-4 w-4" />آپلود لوگو
              <input type="file" accept="image/*" hidden onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                try { set("image_url", await uploadImage(f)); } catch (err) { toast.error((err as Error).message); }
              }} />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <F label="عنوان فارسی"><Input value={b.title_fa ?? ""} onChange={(e) => set("title_fa", e.target.value)} /></F>
            <F label="Title (English)"><Input dir="ltr" value={b.title_en ?? ""} onChange={(e) => set("title_en", e.target.value)} /></F>
            <F label="توضیح کوتاه فارسی"><Textarea value={b.short_fa ?? ""} onChange={(e) => set("short_fa", e.target.value)} /></F>
            <F label="Short description"><Textarea dir="ltr" value={b.short_en ?? ""} onChange={(e) => set("short_en", e.target.value)} /></F>
            <F label="امکانات فارسی (هر خط یکی)"><Textarea rows={6} value={(b.features_fa ?? []).join("\n")} onChange={(e) => set("features_fa", e.target.value.split("\n").filter(Boolean))} /></F>
            <F label="Features (one per line)"><Textarea dir="ltr" rows={6} value={(b.features_en ?? []).join("\n")} onChange={(e) => set("features_en", e.target.value.split("\n").filter(Boolean))} /></F>
            <F label="نامک آدرس (انگلیسی)"><Input dir="ltr" value={b.slug ?? ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></F>
            <F label="لینک خرید"><Input dir="ltr" value={b.link ?? ""} onChange={(e) => set("link", e.target.value)} /></F>
            <F label="ترتیب نمایش"><Input type="number" value={b.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></F>
            <F label="پلتفرم"><Select value={b.platform ?? "telegram"} onValueChange={v => set("platform",v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.id} value={p.id}>{p.fa}</SelectItem>)}</SelectContent></Select></F>
            <F label="دسته موضوعی"><Select value={b.category ?? "tools"} onValueChange={v => set("category",v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.fa}</SelectItem>)}</SelectContent></Select></F>
            {months.map(m => <F key={m} label={`قیمت اشتراک ${m.toLocaleString("fa")} ماهه (تومان)`}><Input type="number" min={1} step={1} value={b[`price_${m}`] ?? ""} onChange={e => set(`price_${m}`,e.target.value === "" ? null : Number(e.target.value))}/></F>)}
            <div className="flex items-center gap-3 pt-6"><Switch checked={b.published ?? true} onCheckedChange={(v) => set("published", v)} /><Label>نمایش در سایت</Label></div>
          </div>
          <Button disabled={busy} onClick={save} className="bg-gradient-primary text-primary-foreground">ذخیره</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}

function ServicesTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(servicesQuery);
  const [rows, setRows] = useState<Partial<Service>[]>([]);
  useEffect(() => setRows(data), [data]);
  const save = async (r: Partial<Service>) => {
    const { id, created_at, ...rest } = r as Service;
    const res = id ? await supabase.from("services").update(rest).eq("id", id) : await supabase.from("services").insert(rest);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("ذخیره شد"); qc.invalidateQueries({ queryKey: ["services"] });
  };
  const del = async (r: Partial<Service>) => {
    if (!r.id) { setRows(rows.filter((x) => x !== r)); return; }
    if (!confirm("حذف این خدمت؟")) return;
    await supabase.from("services").delete().eq("id", r.id); qc.invalidateQueries({ queryKey: ["services"] });
  };
  const upd = (i: number, k: keyof Service, v: unknown) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <>
      <Head title="خدمات" action={<Button onClick={() => setRows([...rows, { icon: "Sparkles", sort_order: rows.length + 1, title_fa: "", title_en: "", desc_fa: "", desc_en: "" }])}><Plus className="h-4 w-4" />خدمت جدید</Button>} />
      <div className="grid gap-4">
        {rows.map((r, i) => (
          <div key={r.id ?? i} className="glass rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
            <F label="عنوان فارسی"><Input value={r.title_fa} onChange={(e) => upd(i, "title_fa", e.target.value)} /></F>
            <F label="Title"><Input dir="ltr" value={r.title_en} onChange={(e) => upd(i, "title_en", e.target.value)} /></F>
            <F label="توضیح فارسی"><Textarea value={r.desc_fa} onChange={(e) => upd(i, "desc_fa", e.target.value)} /></F>
            <F label="Description"><Textarea dir="ltr" value={r.desc_en} onChange={(e) => upd(i, "desc_en", e.target.value)} /></F>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
              {serviceIconNames.map((n) => (
                <button key={n} onClick={() => upd(i, "icon", n)} className={`p-2 rounded-lg ${r.icon === n ? "bg-primary text-primary-foreground" : "bg-muted"}`}><ServiceIcon name={n} /></button>
              ))}
              <div className="ms-auto flex gap-2">
                <Button variant="ghost" onClick={() => del(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                <Button onClick={() => save(r)}>ذخیره</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const generalFields: [keyof General, string, boolean?][] = [
  ["hero_title_fa", "عنوان اصلی صفحه (فارسی)"], ["hero_title_en", "Hero title (English)"],
  ["hero_desc_fa", "توضیح صفحه اصلی (فارسی)", true], ["hero_desc_en", "Hero description", true],
  ["about_fa", "متن درباره ما (فارسی)", true], ["about_en", "About text", true],
  ["telegram_support", "لینک پشتیبانی تلگرام"], ["telegram_channel", "لینک کانال تلگرام"],
  ["email", "ایمیل"], ["instagram", "لینک اینستاگرام"], ["website", "آدرس سایت (برای QR)"],
];

function GeneralTab() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [g, setG] = useState<General | null>(null);
  useEffect(() => { if (data) setG(data); }, [data]);
  if (!g) return null;
  const save = async () => {
    const { error } = await supabase.from("site_settings").upsert({ key: "general", value: g, updated_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    toast.success("تنظیمات ذخیره شد"); qc.invalidateQueries({ queryKey: ["settings"] });
  };
  return (
    <>
      <Head title="تنظیمات و متن‌ها" action={<Button onClick={save}>ذخیره تغییرات</Button>} />
      <div className="glass rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        {generalFields.map(([k, l, long]) => (
          <F key={k} label={l}>
            {long ? <Textarea rows={5} dir={k.endsWith("_en") ? "ltr" : "rtl"} value={g[k] ?? ""} onChange={(e) => setG({ ...g, [k]: e.target.value })} />
              : <Input dir={k.endsWith("_fa") ? "rtl" : "ltr"} value={g[k] ?? ""} onChange={(e) => setG({ ...g, [k]: e.target.value })} />}
          </F>
        ))}
      </div>
    </>
  );
}

function MessagesTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const del = async (id: string) => { await supabase.from("messages").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["messages"] }); };
  return (
    <>
      <Head title="پیام‌های دریافتی" />
      {data.length === 0 && <p className="text-muted-foreground">هنوز پیامی نرسیده است.</p>}
      <div className="grid gap-3">
        {data.map((m) => (
          <div key={m.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div><span className="font-bold">{m.name}</span> <span className="text-sm text-primary" dir="ltr">{m.contact}</span></div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString("fa-IR")}
                <Button size="icon" variant="ghost" onClick={() => del(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-line leading-7">{m.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
