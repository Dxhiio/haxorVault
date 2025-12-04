-- Add summary and tips columns to certifications
ALTER TABLE public.certifications 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS tips TEXT[];

-- Update RLS if needed (existing policies should cover it if they are "ALL" for service role)
