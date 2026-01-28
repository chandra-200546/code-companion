-- Create translations table to store translation history
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  purpose TEXT NOT NULL,
  input_code TEXT NOT NULL,
  output_code TEXT,
  explanation TEXT,
  complexity TEXT,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public tool)
CREATE POLICY "Anyone can insert translations"
ON public.translations
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read translations (for history feature)
CREATE POLICY "Anyone can read translations"
ON public.translations
FOR SELECT
USING (true);