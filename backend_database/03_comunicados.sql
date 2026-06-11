-- ==========================================
-- DDL Schema - Comunicados Oficiais (Sprint 26)
-- ==========================================

-- 1. ENUMS
CREATE TYPE public.announcement_severity AS ENUM ('INFO', 'WARNING', 'EMERGENCY');

-- 2. TABLE
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    severity public.announcement_severity NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. INDEXES
CREATE INDEX idx_announcements_prefeitura ON public.announcements(prefeitura_id);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);

-- 4. RLS POLICIES
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Leitura: Qualquer usuário (cidadão ou admin) que pertença à mesma prefeitura.
CREATE POLICY select_announcements ON public.announcements
    FOR SELECT TO authenticated
    USING (
        public.get_current_user_prefeitura_id() = prefeitura_id
        OR public.get_current_user_role() = 'SYSTEM_ADMIN'
    );

-- Inserção: Apenas Admins (MANAGER, CITY_ADMIN) da mesma prefeitura ou SYSTEM_ADMIN.
-- MANAGER tem access_level = 2, CITY_ADMIN tem 4.
CREATE POLICY insert_announcements ON public.announcements
    FOR INSERT TO authenticated
    WITH CHECK (
        (public.get_current_user_prefeitura_id() = prefeitura_id AND public.get_current_user_access_level() >= 2)
        OR public.get_current_user_role() = 'SYSTEM_ADMIN'
    );

-- Update: NUNCA, conforme restrição do plano. (Sem policy de update)
-- Delete: NUNCA, ou talvez apenas SYSTEM_ADMIN, mas o plano diz "NUNCA INSERT ou UPDATE para cidadão", o que já garantimos.

-- 5. WEBHOOK TRIGGER FOR EDGE FUNCTION
-- Note: Requires pg_net extension to be enabled in Supabase.
-- Assuming standard Supabase edge function invocation via pg_net.
CREATE OR REPLACE FUNCTION public.trigger_broadcast_push()
RETURNS trigger AS $$
BEGIN
  perform net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/broadcast-push',
      headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
      ),
      body := json_build_object(
          'type', 'INSERT',
          'table', 'announcements',
          'schema', 'public',
          'record', row_to_json(NEW)
      )::jsonb
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback for environments where pg_net or settings are not available
    -- In Supabase this is often managed via Dashboard Webhooks.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_announcement_created
    AFTER INSERT ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.trigger_broadcast_push();

-- 6. RPC: FETCH FCM TOKENS FOR BROADCAST
CREATE OR REPLACE FUNCTION public.get_fcm_tokens_by_prefeitura(p_id UUID)
RETURNS TABLE (fcm_token TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT ud.fcm_token
    FROM public.user_devices ud
    JOIN public.user_roles ur ON ud.user_id = ur.user_id
    WHERE ur.prefeitura_id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

