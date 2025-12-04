-- ⚠️ EJECUTA ESTE SCRIPT EN EL EDITOR SQL DE SUPABASE ⚠️

-- 1. Eliminar la tabla incorrecta (que tiene machine_id como UUID)
DROP TABLE IF EXISTS public.user_progress;

-- 2. Crear la tabla correctamente (con machine_id como BIGINT)
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  machine_id BIGINT REFERENCES public.htb_machines(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, machine_id)
);

-- 3. Habilitar seguridad (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de acceso
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Confirmación
SELECT 'Tabla user_progress reparada exitosamente' as status;
