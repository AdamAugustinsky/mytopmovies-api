import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { MovieInMemoryRepository } from './repositories/movie.repository.in-memory';

describe('MoviesService', () => {
  let service: MoviesService;

  const movie: Movie = new Movie();
  movie.id = 1;
  movie.title = 'test title';
  movie.description = 'test description';
  movie.director = 'test director';
  movie.rating = 3;
  movie.releaseDate = new Date();
  movie.imageUrl = 'test image url';

  beforeEach(async () => {
    const movieInMemoryRepository = new MovieInMemoryRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: movieInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    it('should be able to create a movie', async () => {
      const createMovieDto = {
        title: 'test title',
        description: 'test description',
        director: 'test director',
        releaseDate: new Date('2001-01-01'),
        rating: 1,
        imageUrl: 'test image url',
      };

      await expect(service.create(createMovieDto)).resolves.toEqual({
        id: 1,
        ...createMovieDto,
      });
    });
  });

  describe('findAllMovies', () => {
    it('should be able to list all movies', async () => {
      await service.create(movie);
      const movies = await service.findAll();

      expect(movies).toEqual([movie]);
    });
  });

  describe('findOneMovie', () => {
    it('should be able to list one movie', async () => {
      await service.create(movie);
      const requestedMovie = await service.findOne(1);

      expect(requestedMovie).toEqual(movie);
    });

    it('should not be able to list non existent movie', async () => {
      expect(service.findOne(-1)).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('updateMovie', () => {
    it('should be able to update a movie', async () => {
      const updateMovieDto = {
        title: 'updated test title',
        description: 'test description',
        director: 'test director',
        releaseDate: new Date('2001-01-01'),
        rating: 1,
        imageUrl: 'test image url',
      };

      await service.create(updateMovieDto);

      await expect(service.update(1, updateMovieDto)).resolves.toEqual({
        id: 1,
        ...updateMovieDto,
      });
    });

    it('should not be able to update non existent movie', async () => {
      expect(service.update(-1, new UpdateMovieDto())).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  describe('removeMovie', () => {
    it('should be able to delete movie', async () => {
      await service.create(movie);
      await expect(service.remove(1)).toBeTruthy();
    });

    it('should not be able to remove non existent movie', async () => {
      expect(service.remove(-1)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
