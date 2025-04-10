const { User, Movie, Show, Stream, Recommendation, sequelize } = require('./models');

async function seedDatabase() {
  console.log('Seeding database...');

  try {
    // Sync database with force option to clear existing data
    await sequelize.sync({ force: true });

    // Seed users
    const users = await User.bulkCreate([
      { username: 'user1', email: 'user1@example.com', preferences: { genres: ['action', 'sci-fi'] } },
      { username: 'user2', email: 'user2@example.com', preferences: { genres: ['comedy', 'romance'] } },
      { username: 'user3', email: 'user3@example.com', preferences: { genres: ['horror', 'thriller'] } },
      { username: 'user4', email: 'user4@example.com', preferences: { genres: ['documentary', 'drama'] } },
      { username: 'user5', email: 'user5@example.com', preferences: { genres: ['animation', 'family'] } }
    ]);

    // Seed movies
    const movies = await Movie.bulkCreate([
      { title: 'Space Adventure', description: 'An epic journey across galaxies', duration: 120, releaseYear: 2022, genre: ['sci-fi', 'action'], rating: 4.5, imageUrl: 'https://example.com/space.jpg' },
      { title: 'Love Story', description: 'A heartwarming romance', duration: 110, releaseYear: 2021, genre: ['romance', 'drama'], rating: 4.2, imageUrl: 'https://example.com/love.jpg' },
      { title: 'Nightmare House', description: 'A terrifying experience', duration: 95, releaseYear: 2020, genre: ['horror', 'thriller'], rating: 3.8, imageUrl: 'https://example.com/horror.jpg' },
      { title: 'Laugh Out Loud', description: 'Hilarious comedy adventure', duration: 105, releaseYear: 2023, genre: ['comedy', 'family'], rating: 4.0, imageUrl: 'https://example.com/comedy.jpg' },
      { title: 'Ocean Depths', description: 'Documentary about marine life', duration: 85, releaseYear: 2022, genre: ['documentary', 'nature'], rating: 4.7, imageUrl: 'https://example.com/ocean.jpg' }
    ]);

    // Seed shows
    const shows = await Show.bulkCreate([
      { title: 'Galaxy Wars', description: 'Epic space opera series', seasons: 3, episodes: 30, releaseYear: 2020, genre: ['sci-fi', 'action'], rating: 4.6, imageUrl: 'https://example.com/galaxy.jpg' },
      { title: 'City Life', description: 'Drama about urban living', seasons: 5, episodes: 60, releaseYear: 2018, genre: ['drama', 'comedy'], rating: 4.3, imageUrl: 'https://example.com/city.jpg' },
      { title: 'Monster Hunters', description: 'Team of hunters tracking supernatural creatures', seasons: 4, episodes: 48, releaseYear: 2019, genre: ['horror', 'adventure'], rating: 4.1, imageUrl: 'https://example.com/monster.jpg' },
      { title: 'Family Values', description: 'Heartwarming family sitcom', seasons: 6, episodes: 72, releaseYear: 2017, genre: ['comedy', 'family'], rating: 4.0, imageUrl: 'https://example.com/family.jpg' },
      { title: 'True Nature', description: 'Documentary series about wildlife', seasons: 2, episodes: 16, releaseYear: 2021, genre: ['documentary', 'nature'], rating: 4.8, imageUrl: 'https://example.com/nature.jpg' }
    ]);

    // Seed streams
    await Stream.bulkCreate([
      { userId: users[0].id, contentId: movies[0].id, contentType: 'movie', startTime: new Date(Date.now() - 3600000), duration: 7200, quality: 'HD', deviceType: 'smart-tv' },
      { userId: users[1].id, contentId: shows[1].id, contentType: 'show', startTime: new Date(Date.now() - 7200000), duration: 3600, quality: '4K', deviceType: 'mobile' },
      { userId: users[2].id, contentId: movies[2].id, contentType: 'movie', startTime: new Date(Date.now() - 10800000), duration: 5400, quality: 'SD', deviceType: 'tablet' },
      { userId: users[3].id, contentId: shows[3].id, contentType: 'show', startTime: new Date(Date.now() - 14400000), duration: 2700, quality: 'HD', deviceType: 'laptop' },
      { userId: users[4].id, contentId: movies[4].id, contentType: 'movie', startTime: new Date(Date.now() - 18000000), duration: 4800, quality: '4K', deviceType: 'smart-tv' }
    ]);

    // Seed recommendations
    await Recommendation.bulkCreate([
      { userId: users[0].id, contentId: movies[1].id, contentType: 'movie', score: 0.85, reason: 'Similar to content you watched' },
      { userId: users[1].id, contentId: shows[0].id, contentType: 'show', score: 0.78, reason: 'Popular in your area' },
      { userId: users[2].id, contentId: movies[3].id, contentType: 'movie', score: 0.92, reason: 'Based on your preferences' },
      { userId: users[3].id, contentId: shows[2].id, contentType: 'show', score: 0.81, reason: 'Trending now' },
      { userId: users[4].id, contentId: movies[0].id, contentType: 'movie', score: 0.88, reason: 'New release' }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// When run directly, execute the seeding
if (require.main === module) {
  seedDatabase()
    .then(() => console.log('Seeding completed'))
    .catch(err => console.error('Seeding failed:', err));
}