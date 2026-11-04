import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Bot = Database["public"]["Tables"]["bots"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export const generalKeys = ["hero_title_fa","hero_title_en","hero_desc_fa","hero_desc_en","about_fa","about_en","telegram_support","telegram_channel","email","instagram","website"] as const;
export type General = Record<(typeof generalKeys)[number], string>;
const emptyGeneral = Object.fromEntries(generalKeys.map((k) => [k, ""])) as General;

export const settingsQuery = queryOptions({
  queryKey: ["settings", "general"],
  queryFn: async (): Promise<General> => {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", "general").maybeSingle();
    if (error) throw error;
    return { ...emptyGeneral, ...((data?.value as Partial<General>) ?? {}) };
  },
});

export const botsQuery = queryOptions({
  queryKey: ["bots"],
  queryFn: async (): Promise<Bot[]> => {
    const { data, error } = await supabase.from("bots").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async (): Promise<Service[]> => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});
