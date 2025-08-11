-- Add two new movie categories: "Award Winners" and "Modern Blockbusters"
-- These will provide variety and showcase different eras of cinema

-- AWARD WINNERS CATEGORY (Oscar Best Picture Winners)
INSERT INTO movies (
    title, 
    description, 
    release_year, 
    rating, 
    image_url, 
    trailer_url, 
    video_url,
    genres,
    director,
    cast,
    duration
) VALUES 
(
    'Parasite',
    'A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.',
    2019,
    8.5,
    'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    ARRAY['Thriller', 'Drama', 'Comedy'],
    'Bong Joon-ho',
    ARRAY['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik', 'Park So-dam'],
    132
),
(
    'Nomadland',
    'A woman in her sixties embarks on a journey through the western United States after losing everything in the Great Recession, living in a van and working seasonal jobs.',
    2020,
    7.3,
    'https://image.tmdb.org/t/p/w500/6cKhKlJKNhqjNJGMJKbdMNqOJGU.jpg',
    'https://www.youtube.com/watch?v=6sxCFZ8_d84',
    'https://www.youtube.com/watch?v=6sxCFZ8_d84',
    ARRAY['Drama'],
    'Chloé Zhao',
    ARRAY['Frances McDormand', 'David Strathairn', 'Linda May', 'Charlene Swankie'],
    107
),
(
    'Green Book',
    'A working-class Italian-American bouncer becomes the driver of an African-American classical pianist on a tour of venues through the 1960s American South.',
    2018,
    8.2,
    'https://image.tmdb.org/t/p/w500/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg',
    'https://www.youtube.com/watch?v=QkZxoko_HC0',
    'https://www.youtube.com/watch?v=QkZxoko_HC0',
    ARRAY['Biography', 'Comedy', 'Drama'],
    'Peter Farrelly',
    ARRAY['Viggo Mortensen', 'Mahershala Ali', 'Linda Cardellini', 'Sebastian Maniscalco'],
    130
),
(
    'Moonlight',
    'A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.',
    2016,
    7.4,
    'https://image.tmdb.org/t/p/w500/4911T5FbJ9eD2Faz5Z8cT3SUhU9.jpg',
    'https://www.youtube.com/watch?v=9NJj12tJzqc',
    'https://www.youtube.com/watch?v=9NJj12tJzqc',
    ARRAY['Drama'],
    'Barry Jenkins',
    ARRAY['Trevante Rhodes', 'André Holland', 'Janelle Monáe', 'Ashton Sanders', 'Jharrel Jerome'],
    111
),
(
    'The Shape of Water',
    'At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.',
    2017,
    7.3,
    'https://image.tmdb.org/t/p/w500/k4FwHlMhuRR5BISY2Gm2QZHlH5Q.jpg',
    'https://www.youtube.com/watch?v=XFYWazblaUA',
    'https://www.youtube.com/watch?v=XFYWazblaUA',
    ARRAY['Drama', 'Fantasy', 'Romance'],
    'Guillermo del Toro',
    ARRAY['Sally Hawkins', 'Michael Shannon', 'Richard Jenkins', 'Doug Jones', 'Michael Stuhlbarg'],
    123
);

-- MODERN BLOCKBUSTERS CATEGORY (Recent High-Grossing Films)
INSERT INTO movies (
    title, 
    description, 
    release_year, 
    rating, 
    image_url, 
    trailer_url, 
    video_url,
    genres,
    director,
    cast,
    duration
) VALUES 
(
    'Avatar: The Way of Water',
    'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Navi race to protect their home.',
    2022,
    7.6,
    'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    'https://www.youtube.com/watch?v=d9MyW72ELq0',
    'https://www.youtube.com/watch?v=d9MyW72ELq0',
    ARRAY['Action', 'Adventure', 'Sci-Fi'],
    'James Cameron',
    ARRAY['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
    192
),
(
    'Top Gun: Maverick',
    'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUNs elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.',
    2022,
    8.3,
    'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    'https://www.youtube.com/watch?v=qSqVVswa420',
    'https://www.youtube.com/watch?v=qSqVVswa420',
    ARRAY['Action', 'Drama'],
    'Joseph Kosinski',
    ARRAY['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm', 'Glen Powell'],
    130
),
(
    'Black Panther: Wakanda Forever',
    'The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King TChalla.',
    2022,
    6.7,
    'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
    'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
    ARRAY['Action', 'Adventure', 'Drama'],
    'Ryan Coogler',
    ARRAY['Letitia Wright', 'Lupita Nyongo', 'Danai Gurira', 'Winston Duke', 'Angela Bassett'],
    161
),
(
    'Spider-Man: No Way Home',
    'With Spider-Mans identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
    2021,
    8.2,
    'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    ARRAY['Action', 'Adventure', 'Sci-Fi'],
    'Jon Watts',
    ARRAY['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon', 'Jon Favreau'],
    148
),
(
    'Avengers: Endgame',
    'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos actions and restore balance to the universe.',
    2019,
    8.4,
    'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    ARRAY['Action', 'Adventure', 'Drama'],
    'Anthony Russo, Joe Russo',
    ARRAY['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    181
);
