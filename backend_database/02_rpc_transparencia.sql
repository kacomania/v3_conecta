-- ==========================================
-- RPC for Public Transparency Portal
-- ==========================================

CREATE OR REPLACE FUNCTION public.get_public_transparency_metrics(p_prefeitura_id UUID)
RETURNS JSON AS $$
DECLARE
    v_total_resolved INT;
    v_total_in_progress INT;
    v_total_pending INT;
    v_total_analyzing INT;
    v_avg_csat NUMERIC;
    v_completed_pins JSON;
BEGIN
    -- Count totals
    SELECT 
        COUNT(*) FILTER (WHERE status = 'COMPLETED'),
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS'),
        COUNT(*) FILTER (WHERE status = 'PENDING'),
        COUNT(*) FILTER (WHERE status = 'ANALYZING')
    INTO 
        v_total_resolved, v_total_in_progress, v_total_pending, v_total_analyzing
    FROM public.occurrences
    WHERE prefeitura_id = p_prefeitura_id;

    -- Average CSAT (rating)
    SELECT COALESCE(ROUND(AVG(rating), 1), 0.0)
    INTO v_avg_csat
    FROM public.occurrences
    WHERE prefeitura_id = p_prefeitura_id AND status = 'COMPLETED' AND rating IS NOT NULL;

    -- Completed pins
    SELECT COALESCE(json_agg(
        json_build_object(
            'id', o.id,
            'latitude', o.latitude,
            'longitude', o.longitude,
            'categoria', c.name
        )
    ), '[]'::json)
    INTO v_completed_pins
    FROM public.occurrences o
    LEFT JOIN public.categories c ON o.category_id = c.id
    WHERE o.prefeitura_id = p_prefeitura_id AND o.status = 'COMPLETED'
      AND o.latitude IS NOT NULL AND o.longitude IS NOT NULL;

    RETURN json_build_object(
        'totals', json_build_object(
            'resolved', COALESCE(v_total_resolved, 0),
            'in_progress', COALESCE(v_total_in_progress, 0),
            'pending', COALESCE(v_total_pending, 0),
            'analyzing', COALESCE(v_total_analyzing, 0)
        ),
        'avg_csat', v_avg_csat,
        'completed_pins', v_completed_pins
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
