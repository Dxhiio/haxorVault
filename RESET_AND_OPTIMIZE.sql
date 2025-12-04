-- ⚠️ EJECUTA ESTE SCRIPT PARA BORRAR TODO EL PROGRESO Y OPTIMIZAR LA BASE DE DATOS ⚠️

-- 1. Borrar todo el progreso de todos los usuarios (Reset Completo)
TRUNCATE TABLE public.user_progress;

-- 2. Crear índices de rendimiento (Optimización)
-- Estos índices hacen que la app cargue mucho más rápido

-- Roadmap Week Machines
CREATE INDEX IF NOT EXISTS idx_roadmap_week_machines_machine_id ON public.roadmap_week_machines(machine_id);

-- Roadmap Week Techniques
CREATE INDEX IF NOT EXISTS idx_roadmap_week_techniques_technique_id ON public.roadmap_week_techniques(technique_id);

-- User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    achievement_id text,
    unlocked_at timestamp with time zone default timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- User Activity
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    activity_type text,
    details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);

-- User Progress (CRÍTICO)
CREATE INDEX IF NOT EXISTS idx_user_progress_machine_id ON public.user_progress(machine_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- 3. Confirmación
SELECT 'Progreso reseteado y base de datos optimizada correctamente' as status;
