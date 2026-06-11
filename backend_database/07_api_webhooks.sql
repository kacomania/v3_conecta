CREATE TABLE public.webhooks_endpoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prefeitura_id UUID REFERENCES public.prefeituras(id) ON DELETE CASCADE NOT NULL UNIQUE,
    url TEXT NOT NULL,
    secret_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prefeitura_id UUID REFERENCES public.prefeituras(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.webhooks_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Policy for webhooks_endpoints
-- Only CITY_ADMIN (4) and SYSTEM_ADMIN (5) can manage integrations for their tenant (or all for 5)
CREATE POLICY manage_webhooks_endpoints
ON public.webhooks_endpoints
FOR ALL
USING (
    public.get_current_user_access_level() >= 4 
    AND (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_access_level() = 5)
)
WITH CHECK (
    public.get_current_user_access_level() >= 4 
    AND (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_access_level() = 5)
);

-- Policy for api_keys
CREATE POLICY manage_api_keys
ON public.api_keys
FOR ALL
USING (
    public.get_current_user_access_level() >= 4 
    AND (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_access_level() = 5)
)
WITH CHECK (
    public.get_current_user_access_level() >= 4 
    AND (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_access_level() = 5)
);


CREATE OR REPLACE FUNCTION public.trigger_webhook_dispatcher()
RETURNS TRIGGER AS $$
DECLARE
  url TEXT := 'https://jddctbskhxxvspaawtqn.supabase.co/functions/v1/webhook-dispatcher';
  payload JSONB;
BEGIN
  payload := json_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE null END
  );

  PERFORM net.http_post(
    url := url,
    body := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER occurrences_webhook_dispatcher
AFTER INSERT OR UPDATE ON public.occurrences
FOR EACH ROW EXECUTE FUNCTION public.trigger_webhook_dispatcher();
