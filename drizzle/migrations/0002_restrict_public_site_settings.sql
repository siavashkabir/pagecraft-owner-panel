CREATE OR REPLACE FUNCTION public.is_public_site_setting(setting_key text, setting_value jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = public
AS $$
  SELECT COALESCE(setting_key = 'general'
    AND jsonb_typeof(setting_value) = 'object'
    AND setting_value - ARRAY['hero_title_fa','hero_title_en','hero_desc_fa','hero_desc_en','about_fa','about_en','telegram_support','telegram_channel','email','instagram','website']::text[] = '{}'::jsonb, false);
$$;
REVOKE ALL ON FUNCTION public.is_public_site_setting(text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_public_site_setting(text, jsonb) TO anon, authenticated, service_role;
ALTER POLICY "public read settings" ON public.site_settings USING (public.is_public_site_setting(key, value));
COMMENT ON TABLE public.site_settings IS 'Public reads are limited to general website copy/contact fields. Private settings are admin-only; payment credentials must be stored in secrets.';