-- Clear existing data
TRUNCATE TABLE movies;
-- Insert sample movies
INSERT INTO movies (
        title,
        description,
        release_year,
        rating,
        image_url
    )
VALUES (
        'The Matrix',
        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        1999,
        8.7,
        'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
    ),
    (
        'Inception',
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        2010,
        8.8,
        'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    ),
    (
        'Interstellar',
        'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
        2014,
        8.6,
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    ),
    (
        'The Dark Knight',
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        2008,
        9.0,
        'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    ),
    (
        'Pulp Fiction',
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        1994,
        8.9,
        'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
    ),
    (
        'Fight Club',
        'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
        1999,
        8.8,
        'https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg'
    ),
    (
        'Goodfellas',
        'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.',
        1990,
        8.7,
        'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg'
    ),
    (
        'The Godfather',
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        1972,
        9.2,
        'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg'
    ),
    (
        'Blade Runner 2049',
        'A young blade runner''s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who''s been missing for thirty years.',
        2017,
        8.0,
        'https://image.tmdb.org/t/p/w500/aMpyrCizvSdc0UIMblJ1srVgAEF.jpg'
    ),
    (
        'Dune',
        'Feature adaptation of Frank Herbert''s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
        2021,
        8.0,
        'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'
    ),
    (
        'Arrival',
        'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
        2016,
        7.9,
        'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'
    ),
    (
        'Ex Machina',
        'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.',
        2014,
        7.7,
        'https://image.tmdb.org/t/p/w500/pmAv14TPE2vKMIRrVeCd1Ll7K94.jpg'
    );