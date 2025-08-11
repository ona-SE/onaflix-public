-- Update existing movies with trailer URLs
-- Using free demo videos from Google's test content

-- Update The Matrix
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
WHERE title = 'The Matrix';

-- Update Inception
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
WHERE title = 'Inception';

-- Update The Dark Knight
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
WHERE title = 'The Dark Knight';

-- Update Pulp Fiction
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
WHERE title = 'Pulp Fiction';

-- Update Fight Club
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
WHERE title = 'Fight Club';

-- Update The Shawshank Redemption
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
WHERE title = 'The Shawshank Redemption';

-- Update The Godfather
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
WHERE title = 'The Godfather';

-- Update any remaining movies without trailers
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
WHERE trailer_url IS NULL OR trailer_url = '';
