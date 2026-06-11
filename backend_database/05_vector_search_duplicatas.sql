-- Habilita extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Adiciona colunas em occurrences
ALTER TABLE public.occurrences ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE public.occurrences ADD COLUMN IF NOT EXISTS supporters_count INT DEFAULT 0;

-- Cria tabela occurrence_supporters
CREATE TABLE IF NOT EXISTS public.occurrence_supporters (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    occurrence_id UUID REFERENCES public.occurrences(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, occurrence_id)
);

-- Ativa RLS para occurrence_supporters
ALTER TABLE public.occurrence_supporters ENABLE ROW LEVEL SECURITY;

-- Policy (cidadão pode apoiar)
CREATE POLICY "Users can insert their own support" 
ON public.occurrence_supporters FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view supporters" 
ON public.occurrence_supporters FOR SELECT 
USING (true);

-- Drop anterior caso exista
DROP FUNCTION IF EXISTS match_occurrences(vector(768), double precision, double precision, uuid);

-- Cria a RPC
CREATE OR REPLACE FUNCTION match_occurrences(
    query_embedding vector(768),
    query_lat double precision,
    query_lng double precision,
    query_prefeitura_id uuid
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    status public.occurrence_status,
    distance_meters double precision,
    similarity double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    -- Constante do raio da Terra em metros
    R CONSTANT double precision := 6371000;
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.title,
        o.description,
        o.status,
        -- Haversine formula para calcular distância em metros
        (
            2 * R * asin(
                sqrt(
                    sin(radians(o.latitude - query_lat) / 2) ^ 2 +
                    cos(radians(query_lat)) * cos(radians(o.latitude)) *
                    sin(radians(o.longitude - query_lng) / 2) ^ 2
                )
            )
        ) AS distance_meters,
        -- Similaridade de cosseno (1 - cosseno de distância)
        (1 - (o.embedding <=> query_embedding)) AS similarity
    FROM 
        public.occurrences o
    WHERE
        o.prefeitura_id = query_prefeitura_id
        AND o.status IN ('PENDING', 'ANALYZING', 'IN_PROGRESS')
        AND o.embedding IS NOT NULL
        AND o.latitude IS NOT NULL
        AND o.longitude IS NOT NULL
        -- Filtro por distância (Haversine) <= 100 metros
        AND (
            2 * R * asin(
                sqrt(
                    sin(radians(o.latitude - query_lat) / 2) ^ 2 +
                    cos(radians(query_lat)) * cos(radians(o.latitude)) *
                    sin(radians(o.longitude - query_lng) / 2) ^ 2
                )
            )
        ) <= 100
        -- Filtro por similaridade >= 0.75
        AND (1 - (o.embedding <=> query_embedding)) >= 0.75
    ORDER BY 
        similarity DESC, distance_meters ASC
    LIMIT 5;
END;
$$;
