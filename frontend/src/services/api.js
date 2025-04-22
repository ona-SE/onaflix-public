const API_BASE_URL = window.location.hostname.endsWith('.gitpod.dev')
  ? 'https://3001--01965c3b-370d-7463-845d-125a1daa5fab.eu01.gitpod.dev/api'
  : 'http://localhost:3001/api';

export const fetchMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
