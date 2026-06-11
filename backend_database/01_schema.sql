-- ==========================================
-- DDL Schema - Conecta v3 (Cidadão Conecta)
-- Single Source of Truth: docs/conecta_v3_master_blueprint.md
-- ==========================================

-- 1. ENUMS & EXTENSIONS
CREATE TYPE public.occurrence_status AS ENUM ('PENDING', 'ANALYZING', 'IN_PROGRESS', 'COMPLETED');

-- 2. TABLES

-- Table: prefeituras (SaaS Tenants)
CREATE TABLE public.prefeituras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    primary_color TEXT,
    secondary_color TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: departments
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    sla_hours INT DEFAULT 72,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: roles (Dynamic RBAC)
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    access_level INT NOT NULL DEFAULT 0 CHECK (access_level BETWEEN 0 AND 5),
    prefeitura_id UUID REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: user_roles (Role-Based Access Control)
CREATE TABLE public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    prefeitura_id UUID REFERENCES public.prefeituras(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: user_departments (N:N Dynamic RBAC)
CREATE TABLE public.user_departments (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    prefeitura_id UUID REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, department_id)
);

-- View: admin_user_emails
CREATE OR REPLACE VIEW public.admin_user_emails AS
SELECT id, email 
FROM auth.users 
WHERE public.get_current_user_access_level() >= 3;

-- Table: occurrences
CREATE TABLE public.occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    status public.occurrence_status NOT NULL DEFAULT 'PENDING',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    due_date TIMESTAMPTZ,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    feedback_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: occurrence_audit_logs (Immutable Audit Trail)
CREATE TABLE public.occurrence_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurrence_id UUID NOT NULL REFERENCES public.occurrences(id) ON DELETE CASCADE,
    altered_by UUID NOT NULL REFERENCES auth.users(id),
    old_category TEXT NOT NULL,
    new_category TEXT NOT NULL,
    old_department TEXT NOT NULL,
    new_department TEXT NOT NULL,
    reason TEXT NOT NULL,
    protocol_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: internal_notes (Separate from Audit Logs for Admin Triage Notes)
CREATE TABLE public.internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurrence_id UUID NOT NULL REFERENCES public.occurrences(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: system_audit_logs (RBAC and System Changes Audit Trail)
CREATE TABLE public.system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    old_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    new_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    old_department_ids UUID[],
    new_department_ids UUID[],
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table: portal_pages
CREATE TABLE public.portal_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL UNIQUE,
    required_level INT NOT NULL CHECK (required_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX idx_occurrences_prefeitura ON public.occurrences(prefeitura_id);
CREATE INDEX idx_occurrences_status     ON public.occurrences(status);
CREATE INDEX idx_occurrences_department ON public.occurrences(department_id);
CREATE INDEX idx_internal_notes_occurrence ON public.internal_notes(occurrence_id);
CREATE INDEX idx_internal_notes_prefeitura ON public.internal_notes(prefeitura_id);

-- 4. ANTI-RECURSION HELPER FUNCTIONS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
    SELECT r.name 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_access_level()
RETURNS INT AS $$
    SELECT r.access_level 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_department_ids()
RETURNS UUID[] AS $$
    SELECT array_agg(department_id) 
    FROM public.user_departments 
    WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_prefeitura_id()
RETURNS UUID AS $$
    SELECT prefeitura_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- RLS prefeituras
ALTER TABLE public.prefeituras ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_prefeituras ON public.prefeituras
    FOR SELECT
    USING (true);

CREATE POLICY all_prefeituras_system_admin ON public.prefeituras
    FOR ALL TO authenticated
    USING (public.get_current_user_role() = 'SYSTEM_ADMIN');

-- RLS departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_departments ON public.departments
    FOR SELECT TO authenticated
    USING (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_role() = 'SYSTEM_ADMIN');

CREATE POLICY admin_all_departments ON public.departments
    FOR ALL TO authenticated
    USING ((public.get_current_user_access_level() >= 4 AND public.get_current_user_prefeitura_id() = prefeitura_id) OR public.get_current_user_role() = 'SYSTEM_ADMIN');

-- RLS categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_categories ON public.categories
    FOR SELECT TO authenticated
    USING (public.get_current_user_prefeitura_id() = prefeitura_id OR public.get_current_user_role() = 'SYSTEM_ADMIN');

CREATE POLICY all_categories_system_admin ON public.categories
    FOR ALL TO authenticated
    USING ((public.get_current_user_access_level() >= 4 AND public.get_current_user_prefeitura_id() = prefeitura_id) OR public.get_current_user_role() = 'SYSTEM_ADMIN');

-- RLS roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_roles ON public.roles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY admin_all_roles ON public.roles
    FOR ALL TO authenticated
    USING (public.get_current_user_access_level() >= 4);

-- RLS user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user_roles ON public.user_roles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.get_current_user_access_level() >= 3);

CREATE POLICY insert_update_user_roles ON public.user_roles
    FOR ALL TO authenticated
    USING (public.get_current_user_access_level() >= 4);

-- RLS user_departments
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user_departments ON public.user_departments
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.get_current_user_access_level() >= 3);

CREATE POLICY insert_update_delete_user_departments ON public.user_departments
    FOR ALL TO authenticated
    USING (public.get_current_user_access_level() >= 4);

-- RLS occurrences
ALTER TABLE public.occurrences ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_occurrences ON public.occurrences
    FOR SELECT TO authenticated
    USING (
        (get_current_user_role() IN ('SYSTEM_ADMIN', 'AUDITOR')) 
        OR ((get_current_user_role() = 'USER') AND (auth.uid() = user_id)) 
        OR ((get_current_user_role() NOT IN ('USER', 'SYSTEM_ADMIN', 'AUDITOR')) AND (get_current_user_prefeitura_id() = prefeitura_id))
    );

CREATE POLICY insert_occurrences ON public.occurrences
    FOR INSERT TO authenticated
    WITH CHECK (
        public.get_current_user_role() = 'SYSTEM_ADMIN' 
        OR (public.get_current_user_role() = 'USER' AND auth.uid() = user_id)
        OR public.get_current_user_prefeitura_id() = prefeitura_id
    );

CREATE POLICY update_occurrences ON public.occurrences
    FOR UPDATE TO authenticated
    USING (
        public.get_current_user_role() = 'SYSTEM_ADMIN' 
        OR (public.get_current_user_role() = 'USER' AND auth.uid() = user_id)
        OR (public.get_current_user_prefeitura_id() = prefeitura_id AND public.get_current_user_access_level() >= 1)
    );

CREATE POLICY delete_occurrences ON public.occurrences
    FOR DELETE TO authenticated
    USING (public.get_current_user_role() = 'SYSTEM_ADMIN' OR (public.get_current_user_prefeitura_id() = prefeitura_id AND public.get_current_user_access_level() >= 4));

-- RLS occurrence_audit_logs
ALTER TABLE public.occurrence_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_audit_logs ON public.occurrence_audit_logs
    FOR SELECT TO authenticated
    USING (
        public.get_current_user_role() = 'SYSTEM_ADMIN' 
        OR (
            public.get_current_user_prefeitura_id() = (SELECT prefeitura_id FROM public.occurrences WHERE id = occurrence_id) 
            AND (
                public.get_current_user_access_level() >= 2 
                OR (SELECT department_id FROM public.occurrences WHERE id = occurrence_id) = ANY(COALESCE(public.get_current_user_department_ids(), ARRAY[]::UUID[]))
            )
        )
    );

CREATE POLICY insert_audit_logs ON public.occurrence_audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.get_current_user_access_level() >= 1);

-- RLS internal_notes
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_internal_notes ON public.internal_notes
    FOR SELECT TO authenticated
    USING (public.get_current_user_role() = 'SYSTEM_ADMIN' OR (public.get_current_user_prefeitura_id() = prefeitura_id AND public.get_current_user_access_level() >= 1));

CREATE POLICY insert_internal_notes ON public.internal_notes
    FOR INSERT TO authenticated
    WITH CHECK (public.get_current_user_role() = 'SYSTEM_ADMIN' OR (public.get_current_user_prefeitura_id() = prefeitura_id AND public.get_current_user_access_level() >= 1));

-- RLS portal_pages
ALTER TABLE public.portal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_portal_pages ON public.portal_pages
    FOR SELECT TO authenticated
    USING (public.get_current_user_access_level() >= required_level);

CREATE POLICY all_portal_pages ON public.portal_pages
    FOR ALL TO authenticated
    USING (public.get_current_user_access_level() >= 4);

-- RLS system_audit_logs
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_system_audit_logs ON public.system_audit_logs
    FOR SELECT TO authenticated
    USING (public.get_current_user_access_level() >= 3);

CREATE POLICY insert_system_audit_logs ON public.system_audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.get_current_user_access_level() >= 4);

-- 6. TRIGGERS

-- Trigger 1: Automatic User Profile Creation in public.user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_role_id UUID;
    target_role_name TEXT;
BEGIN
    target_role_name := COALESCE(new.raw_user_meta_data ->> 'role', 'USER');
    SELECT id INTO default_role_id FROM public.roles WHERE name = target_role_name LIMIT 1;
    INSERT INTO public.user_roles (user_id, role_id, prefeitura_id)
    VALUES (
        new.id,
        default_role_id,
        (new.raw_user_meta_data ->> 'prefeitura_id')::uuid
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Immutable Audit Log Protocol Number Generation
CREATE SEQUENCE public.occurrence_audit_protocol_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.tg_fn_generate_audit_protocol()
RETURNS TRIGGER AS $$
DECLARE
    next_val INT;
    year_prefix TEXT;
BEGIN
    next_val := nextval('public.occurrence_audit_protocol_seq');
    year_prefix := to_char(now(), 'YYYY');
    NEW.protocol_number := 'ALT-' || year_prefix || '-' || lpad(next_val::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_generate_audit_protocol
    BEFORE INSERT ON public.occurrence_audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.tg_fn_generate_audit_protocol();

-- Trigger 3: Calculate Due Date (SLA)
CREATE OR REPLACE FUNCTION public.calculate_due_date()
RETURNS trigger AS $$
DECLARE
    v_sla_hours INT;
BEGIN
    IF NEW.category_id IS NOT NULL THEN
        SELECT sla_hours INTO v_sla_hours FROM public.categories WHERE id = NEW.category_id;
    END IF;
    
    IF v_sla_hours IS NULL THEN
        v_sla_hours := 72;
    END IF;

    IF NEW.due_date IS NULL THEN
        NEW.due_date := timezone('utc', now()) + (v_sla_hours || ' hours')::interval;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_occurrence_before_insert
    BEFORE INSERT ON public.occurrences
    FOR EACH ROW EXECUTE FUNCTION public.calculate_due_date();
