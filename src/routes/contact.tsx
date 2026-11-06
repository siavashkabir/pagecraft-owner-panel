import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Send, Mail, Megaphone, Instagram } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "./about";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با ما | SK Team" },
      { name: "description", content: "سفارش ربات و مشاوره رایگان با SK Team از طریق تلگرام، ایمیل یا فرم تماس." },
      { property: "og:title", content: "تماس با SK Team" },
      { property: "og:description", content: "برای سفارش و مشاوره با ما در ارتباط باشید." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(settingsQuery),
  component: Contact,
});

function Contact() {
  const { t } = useLang();
  const { data: s } = useSuspenseQuery(settingsQuery);
  const [f, setF] = useState({ name: "", contact: "", body: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("messages").insert(f);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("sent"));
    setF({ name: "", contact: "", body: "" });
  };
  const links = [
    [s.telegram_support, Send, t("support")], [s.telegram_channel, Megaphone, t("channel")],
    [s.email && `mailto:${s.email}`, Mail, s.email], [s.instagram, Instagram, t("instagram")],
  ] as const;
  return (
    <>
      <PageHero title={t("contactTitle")} desc={t("contactDesc")} />
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1fr_1.4fr] gap-8">
        <div className="space-y-4">
          {links.filter((l) => l[0]).map(([href, Icon, label]) => (
            <a key={label} href={href!} target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary transition-colors">
              <span className="h-12 w-12 rounded-xl bg-primary/15 text-primary grid place-items-center"><Icon /></span>
              <span className="font-semibold">{label}</span>
            </a>
          ))}
          {s.website && (
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(s.website)}`} alt="QR" className="h-24 w-24 rounded-lg bg-foreground p-1" />
              <span className="text-sm text-muted-foreground" dir="ltr">{s.website}</span>
            </div>
          )}
        </div>
        <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-4">
          <Input required maxLength={100} placeholder={t("name")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input required maxLength={200} placeholder={t("contactField")} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
          <Textarea required maxLength={3000} rows={6} placeholder={t("message")} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <Button disabled={busy} type="submit" size="lg" className="w-full rounded-full bg-gradient-primary text-primary-foreground">{t("send")}</Button>
        </form>
      </div>
    </>
  );
}
