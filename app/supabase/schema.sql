-- ============================================
-- ZenNotes Database Schema
-- Execute this in Supabase SQL Editor
-- ============================================

-- 1. Create the daily_notes table
CREATE TABLE IF NOT EXISTS public.daily_notes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    content     TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Enforce one note per user per day
    CONSTRAINT unique_user_date UNIQUE (user_id, note_date)
);

-- Index for fast lookups by user + date
CREATE INDEX IF NOT EXISTS idx_daily_notes_user_date 
    ON public.daily_notes (user_id, note_date DESC);

-- 2. Enable Row Level Security
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT only their own rows
CREATE POLICY "Users can read own notes"
    ON public.daily_notes FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can INSERT only their own rows
CREATE POLICY "Users can insert own notes"
    ON public.daily_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE only their own rows
CREATE POLICY "Users can update own notes"
    ON public.daily_notes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE only their own rows
CREATE POLICY "Users can delete own notes"
    ON public.daily_notes FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.daily_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
