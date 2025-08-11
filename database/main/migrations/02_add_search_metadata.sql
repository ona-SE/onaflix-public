-- Add search and filtering metadata to movies table
ALTER TABLE movies ADD COLUMN IF NOT EXISTS genres TEXT[];
ALTER TABLE movies ADD COLUMN IF NOT EXISTS director VARCHAR(255);
ALTER TABLE movies ADD COLUMN IF NOT EXISTS cast TEXT[];
ALTER TABLE movies ADD COLUMN IF NOT EXISTS duration INTEGER; -- in minutes
ALTER TABLE movies ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'movie';
ALTER TABLE movies ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_movies_title_search ON movies USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_movies_description_search ON movies USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_movies_genres ON movies USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating);
CREATE INDEX IF NOT EXISTS idx_movies_duration ON movies(duration);

-- Create a combined search index for full-text search
CREATE INDEX IF NOT EXISTS idx_movies_full_search ON movies 
USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')));
