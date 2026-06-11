-- ==========================================
-- Migration 06: Fix Multi-Tenant Unique Constraints
-- ==========================================

-- Drop global unique constraints that prevent different prefeituras from having the same department/category names
ALTER TABLE public.departments DROP CONSTRAINT IF EXISTS departments_name_key;
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_key;

-- Add composite unique constraints (name + prefeitura_id)
ALTER TABLE public.departments ADD CONSTRAINT departments_name_prefeitura_id_key UNIQUE (name, prefeitura_id);
ALTER TABLE public.categories ADD CONSTRAINT categories_name_prefeitura_id_key UNIQUE (name, prefeitura_id);
