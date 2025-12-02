-- Create techniques table (master list of all unique techniques)
CREATE TABLE IF NOT EXISTS public.techniques (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Technique',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create machine_techniques junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.machine_techniques (
  machine_id INTEGER NOT NULL REFERENCES public.htb_machines(id) ON DELETE CASCADE,
  technique_id INTEGER NOT NULL REFERENCES public.techniques(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (machine_id, technique_id)
);

-- Enable RLS
ALTER TABLE public.techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machine_techniques ENABLE ROW LEVEL SECURITY;

-- Public read access for techniques
CREATE POLICY "Techniques are viewable by everyone"
  ON public.techniques FOR SELECT
  USING (true);

-- Public read access for machine_techniques
CREATE POLICY "Machine techniques are viewable by everyone"
  ON public.machine_techniques FOR SELECT
  USING (true);

-- Service role can manage techniques
CREATE POLICY "Service role can manage techniques"
  ON public.techniques FOR ALL
  USING (auth.role() = 'service_role');

-- Service role can manage machine_techniques
CREATE POLICY "Service role can manage machine_techniques"
  ON public.machine_techniques FOR ALL
  USING (auth.role() = 'service_role');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_machine_techniques_machine_id ON public.machine_techniques(machine_id);
CREATE INDEX IF NOT EXISTS idx_machine_techniques_technique_id ON public.machine_techniques(technique_id);
CREATE INDEX IF NOT EXISTS idx_techniques_name ON public.techniques(name);
