import { describe, expect, it } from "vitest";
import { supabase } from "@/integrations/supabase/client";

describe("Public settings database policy", () => {
  it("permits public website copy", async () => {
    const { data, error } = await supabase.rpc("is_public_site_setting", { setting_key: "general", setting_value: { hero_title_fa: "SK Team" } });
    expect(error).toBeNull();
    expect(data).toBe(true);
  });
  it("rejects private settings records", async () => {
    const { data, error } = await supabase.rpc("is_public_site_setting", { setting_key: "payment", setting_value: {} });
    expect(error).toBeNull();
    expect(data).toBe(false);
  });
  it("rejects private fields even inside general", async () => {
    const { data, error } = await supabase.rpc("is_public_site_setting", { setting_key: "general", setting_value: { merchant_code: "test-not-a-secret" } });
    expect(error).toBeNull();
    expect(data).toBe(false);
  });
});