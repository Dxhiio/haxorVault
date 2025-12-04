-- ⚠️ EJECUTA ESTE SCRIPT EN EL EDITOR SQL DE SUPABASE PARA MEJORAR EL RENDIMIENTO ⚠️

-- Estos índices solucionan los warnings de "Unindexed foreign keys"
-- Ayudan a que las búsquedas y relaciones entre tablas sean mucho más rápidas.

-- 1. Roadmap Week Machines
CREATE INDEX IF NOT EXISTS idx_roadmap_week_machines_machine_id ON public.roadmap_week_machines(machine_id);

-- 2. Roadmap Week Techniques
CREATE INDEX IF NOT EXISTS idx_roadmap_week_techniques_technique_id ON public.roadmap_week_techniques(technique_id);

-- 3. User Achievements (si existe la tabla)
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- 4. User Activity (si existe la tabla)
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);

-- 5. User Progress (CRÍTICO para el perfil)
CREATE INDEX IF NOT EXISTS idx_user_progress_machine_id ON public.user_progress(machine_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- Confirmación
SELECT 'Índices de rendimiento creados exitosamente' as status;
