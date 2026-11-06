import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getPublicBots, getPublicServices, getPublicSettings } from "./content.functions";

export type Bot = Database["public"]["Tables"]["bots"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export const generalKeys = ["hero_title_fa","hero_title_en","hero_desc_fa","hero_desc_en","about_fa","about_en","telegram_support","telegram_channel","email","instagram","website"] as const;
export type General = Record<(typeof generalKeys)[number], string>;
const emptyGeneral = Object.fromEntries(generalKeys.map((k) => [k, ""])) as General;

export const settingsQuery = queryOptions({
  queryKey: ["settings", "general"],
  queryFn: async (): Promise<General> => {
    const value = await getPublicSettings();
    return { ...emptyGeneral, ...((value as Partial<General>) ?? {}) };
  },
});

export const botsQuery = queryOptions({
  queryKey: ["bots"],
  queryFn: async (): Promise<Bot[]> => {
    return getPublicBots();
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async (): Promise<Service[]> => {
    return getPublicServices();
  },
});

export const adminBotsQuery = queryOptions({ queryKey: ["bots", "admin"], queryFn: async (): Promise<Bot[]> => { const { data, error } = await supabase.from("bots").select("*").order("sort_order"); if (error) throw error; return data; } });
