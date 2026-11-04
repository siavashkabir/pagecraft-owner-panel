import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Bot = Database["public"]["Tables"]["bots"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type General = Record<string, string>;

export const settingsQuery = queryOptions({
  queryKey: ["settings", "general"],
  queryFn: async (): Promise<General> => {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", "general").maybeSingle();
    if (error) throw error;
    return (data?.value as General) ?? {};
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
