-- Translation Cache Table
-- Stores translations of dynamic content (teacher names, experience, etc.)
-- First request translates via API, saves here, subsequent requests are instant

CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_text TEXT NOT NULL,
    source_lang VARCHAR(5) NOT NULL DEFAULT 'ar',
    target_lang VARCHAR(5) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicates
    CONSTRAINT unique_translation UNIQUE (source_text, source_lang, target_lang)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
ON translations (source_lang, target_lang, source_text);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read translations
DROP POLICY IF EXISTS "translations_read_all" ON translations;
CREATE POLICY "translations_read_all" ON translations
    FOR SELECT USING (true);

-- Policy: Only authenticated users can insert (via server actions)
DROP POLICY IF EXISTS "translations_insert_authenticated" ON translations;
CREATE POLICY "translations_insert_authenticated" ON translations
    FOR INSERT WITH CHECK (true);

-- Add comment
COMMENT ON TABLE translations IS 'Cache for dynamic content translations. First API call saves here, subsequent requests are instant.';
