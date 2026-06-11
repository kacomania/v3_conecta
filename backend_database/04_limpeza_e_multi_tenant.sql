BEGIN;

-- 1. Limpeza de dados antigos (Os ON DELETE CASCADE limparão audit logs, notes, etc)
TRUNCATE TABLE public.departments CASCADE;
TRUNCATE TABLE public.occurrences CASCADE;
TRUNCATE TABLE public.announcements CASCADE;

-- 2. Adicionar as novas colunas obrigatórias (se já não existirem)
ALTER TABLE public.departments 
  ADD COLUMN IF NOT EXISTS prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE;

ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE;

-- 3. Recriar os Índices para otimização
CREATE INDEX IF NOT EXISTS idx_departments_prefeitura ON public.departments(prefeitura_id);
CREATE INDEX IF NOT EXISTS idx_categories_prefeitura ON public.categories(prefeitura_id);

-- 4. Atualizar RLS de Departments
DROP POLICY IF EXISTS select_departments ON public.departments;
CREATE POLICY select_departments ON public.departments
    FOR SELECT TO authenticated
    USING (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_role() = 'SYSTEM_ADMIN');

DROP POLICY IF EXISTS admin_all_departments ON public.departments;
CREATE POLICY admin_all_departments ON public.departments
    FOR ALL TO authenticated
    USING ((public.get_current_user_access_level() >= 4 AND public.get_current_user_prefeitura_id() = prefeitura_id) OR public.get_current_user_role() = 'SYSTEM_ADMIN');

-- 5. Atualizar RLS de Categories
DROP POLICY IF EXISTS select_categories ON public.categories;
CREATE POLICY select_categories ON public.categories
    FOR SELECT TO authenticated
    USING (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_role() = 'SYSTEM_ADMIN');

DROP POLICY IF EXISTS all_categories_system_admin ON public.categories;
CREATE POLICY all_categories_system_admin ON public.categories
    FOR ALL TO authenticated
    USING ((public.get_current_user_access_level() >= 4 AND public.get_current_user_prefeitura_id() = prefeitura_id) OR public.get_current_user_role() = 'SYSTEM_ADMIN');

COMMIT;
