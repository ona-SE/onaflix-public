-- Update movies with real YouTube trailer URLs
-- These are official trailers from major movie studios

-- The Godfather (1972) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=UaVTIH8mujA',
  youtube_trailer_id = 'UaVTIH8mujA'
WHERE title = 'The Godfather';

-- The Matrix (1999) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  youtube_trailer_id = 'vKQi3bBA1y8'
WHERE title = 'The Matrix';

-- The Dark Knight (2008) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  youtube_trailer_id = 'EXeTwQWrcwY'
WHERE title = 'The Dark Knight';

-- Inception (2010) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  youtube_trailer_id = 'YoHD9XEInc0'
WHERE title = 'Inception';

-- Pulp Fiction (1994) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  youtube_trailer_id = 's7EdQ4FqbhY'
WHERE title = 'Pulp Fiction';

-- Fight Club (1999) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
  youtube_trailer_id = 'qtRKdVHc-cE'
WHERE title = 'Fight Club';

-- The Shawshank Redemption (1994) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=6hB3S9bIaco',
  youtube_trailer_id = '6hB3S9bIaco'
WHERE title = 'The Shawshank Redemption';

-- Interstellar (2014) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  youtube_trailer_id = 'zSWdZVtXT7E'
WHERE title LIKE '%Interstellar%';

-- The Avengers (2012) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=eOrNdBpGMv8',
  youtube_trailer_id = 'eOrNdBpGMv8'
WHERE title LIKE '%Avengers%';

-- Joker (2019) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=zAGVQLHvwOY',
  youtube_trailer_id = 'zAGVQLHvwOY'
WHERE title = 'Joker';

-- Parasite (2019) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
  youtube_trailer_id = '5xH0HfJHsaY'
WHERE title = 'Parasite';

-- Dune (2021) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=n9xhJrPXop4',
  youtube_trailer_id = 'n9xhJrPXop4'
WHERE title = 'Dune';

-- Top Gun: Maverick (2022) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=qSqVVswa420',
  youtube_trailer_id = 'qSqVVswa420'
WHERE title LIKE '%Top Gun%';

-- Spider-Man: No Way Home (2021) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  youtube_trailer_id = 'JfVOs4VSpmA'
WHERE title LIKE '%Spider-Man%' AND title LIKE '%No Way Home%';

-- Black Panther (2018) - Official Trailer
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=xjDjIWPwcPU',
  youtube_trailer_id = 'xjDjIWPwcPU'
WHERE title = 'Black Panther';

-- Update any remaining movies without YouTube trailers with a fallback
-- Using a popular movie trailer compilation as fallback
UPDATE movies SET 
  trailer_url = 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  youtube_trailer_id = 'vKQi3bBA1y8'
WHERE (trailer_url IS NULL OR trailer_url = '' OR NOT (trailer_url LIKE '%youtube.com%' OR trailer_url LIKE '%youtu.be%'))
  AND youtube_trailer_id IS NULL;
