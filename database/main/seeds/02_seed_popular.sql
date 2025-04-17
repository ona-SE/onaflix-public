-- Insert popular movies
INSERT INTO movies (
        title,
        description,
        release_year,
        rating,
        image_url
    )
VALUES (
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
    );