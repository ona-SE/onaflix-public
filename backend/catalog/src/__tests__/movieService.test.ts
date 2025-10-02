import { MovieService } from '../services/movieService';
import { MovieRepository } from '../repositories/movieRepository';
import { CacheService } from '../services/cacheService';
import { Movie } from '../types/movie.types';

jest.mock('../repositories/movieRepository');
jest.mock('../services/cacheService');

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: jest.Mocked<MovieRepository>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(() => {
    movieRepository = new MovieRepository(null as any) as jest.Mocked<MovieRepository>;
    cacheService = new CacheService(null as any) as jest.Mocked<CacheService>;
    movieService = new MovieService(movieRepository, cacheService);

    jest.clearAllMocks();
  });

  describe('getAllMovies', () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        release_year: 2020,
        rating: 8.5,
        image_url: 'http://test.com/image.jpg',
        duration: 120,
        director: 'Test Director',
        genres: ['Action'],
        movie_cast: ['Actor 1'],
        trailer_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    it('should return cached movies if available', async () => {
      cacheService.get.mockResolvedValue(mockMovies);

      const result = await movieService.getAllMovies();

      expect(result).toEqual(mockMovies);
      expect(cacheService.get).toHaveBeenCalledWith('movies:all');
      expect(movieRepository.findAll).not.toHaveBeenCalled();
    });

    it('should fetch from repository and cache if not cached', async () => {
      cacheService.get.mockResolvedValue(null);
      movieRepository.findAll.mockResolvedValue(mockMovies);

      const result = await movieService.getAllMovies();

      expect(result).toEqual(mockMovies);
      expect(movieRepository.findAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('movies:all', mockMovies, 300);
    });
  });

  describe('searchMovies', () => {
    it('should parse genre filters correctly', async () => {
      cacheService.get.mockResolvedValue(null);
      movieRepository.search.mockResolvedValue({ movies: [], total: 0 });

      await movieService.searchMovies({ genres: 'Action,Drama' as any });

      expect(movieRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          genres: ['Action', 'Drama'],
        })
      );
    });

    it('should apply default limit and offset', async () => {
      cacheService.get.mockResolvedValue(null);
      movieRepository.search.mockResolvedValue({ movies: [], total: 0 });

      await movieService.searchMovies({});

      expect(movieRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
          offset: 0,
        })
      );
    });
  });

  describe('getSuggestions', () => {
    it('should return empty array for short search terms', async () => {
      const result = await movieService.getSuggestions('a');

      expect(result).toEqual([]);
      expect(cacheService.get).not.toHaveBeenCalled();
    });

    it('should return cached suggestions if available', async () => {
      const mockSuggestions = [{ text: 'Action', type: 'genre' as const, frequency: 5 }];
      cacheService.get.mockResolvedValue(mockSuggestions);

      const result = await movieService.getSuggestions('act');

      expect(result).toEqual(mockSuggestions);
      expect(movieRepository.getSuggestions).not.toHaveBeenCalled();
    });
  });

  describe('seedDatabase', () => {
    it('should seed database and invalidate caches', async () => {
      movieRepository.seed.mockResolvedValue();
      cacheService.delPattern.mockResolvedValue();

      await movieService.seedDatabase();

      expect(movieRepository.seed).toHaveBeenCalled();
      expect(cacheService.delPattern).toHaveBeenCalledWith('movies:*');
      expect(cacheService.delPattern).toHaveBeenCalledWith('search:*');
      expect(cacheService.delPattern).toHaveBeenCalledWith('suggestions:*');
    });
  });
});
