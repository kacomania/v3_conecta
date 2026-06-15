-- ==========================================
-- Migration 08: Fix Categories Unique Constraint
-- ==========================================

-- A restrição anterior impedia criar a mesma categoria (ex: "Limpeza") em secretarias diferentes.
-- Atualizamos para permitir nomes iguais desde que em departamentos (secretarias) distintos.
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_prefeitura_id_key;

ALTER TABLE public.categories ADD CONSTRAINT categories_name_department_id_key UNIQUE (name, department_id);
