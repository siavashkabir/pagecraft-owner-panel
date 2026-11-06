import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { projectSchema } from "./store";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Content service is unavailable");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization"); headers.set("apikey", key); return fetch(input, { ...init, headers }); } } });
}
export const getPublicBots = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("bots").select("*").eq("published", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});
export const getPublicServices = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("services").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});
export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("site_settings").select("value").eq("key", "general").maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value ?? {};
});
export const submitProject = createServerFn({ method: "POST" }).inputValidator((input: unknown) => projectSchema.parse(input)).handler(async ({ data }) => {
  const body = `[${data.kind === "bot" ? "ربات سفارشی" : "طراحی سایت"}]\nپلتفرم: ${data.platform}\nمدل: ${data.model}\nسبک: ${data.style}\nبودجه: ${data.budget || "تعیین نشده"}\nمرحله: ایده / درخواست برآورد\n${data.idea}`;
  const { error } = await publicClient().from("messages").insert({ name: data.name, contact: data.contact, body });
  if (error) throw new Error("ثبت درخواست انجام نشد؛ دوباره تلاش کنید.");
  return { ok: true };
});