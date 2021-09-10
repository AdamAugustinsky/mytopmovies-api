import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { request } from 'http';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

const mockMovie: Movie = new Movie();
mockMovie.id = 0;
mockMovie.title = "test title";
mockMovie.description = "test description";
mockMovie.director = "test director";
mockMovie.imageUrl = "http://en.wikipedia.org/wiki/File:Ada_lovelace.jpg";
mockMovie.releaseDate = new Date('2001-01-01');
mockMovie.rating = 5;

describe('MoviesController', () => {
  let controller: MoviesController;

  const movie: Movie = new Movie();
  movie.id = 1;
  movie.title = "test title";
  movie.description = "test description";
  movie.director = "test director";
  movie.rating = 3;
  movie.releaseDate = new Date();
  movie.imageUrl = "test image url";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            create: jest.fn((createMovieDto: CreateMovieDto) => {
              const newMovie: Movie = new Movie();
              Object.assign(newMovie, { id: 1, ...createMovieDto });
              return Promise.resolve(newMovie);
            }),
            save: jest.fn((movie: Movie) => Promise.resolve(movie)),
            find: jest.fn(() => Promise.resolve([movie])),
            findOne: jest.fn((id: number) => {
              movie.id = id;
              return movie;
            }),
          }
        }
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("createMovie", () => {
    it('should be able to create a movie', async () => {
      const createMovieDto = {
        title: "test title",
        description: "test description",
        director: "test director",
        releaseDate: new Date('2001-01-01'),
        rating: 1,
        imageUrl: "test image url",
      };

      await expect(controller.create(createMovieDto)).resolves.toEqual({
        id: 1,
        ...createMovieDto
      });
    });
  });

  describe("findAllMovies", () => {
    it('should be able to list all movies', async () => {
      const movies = await controller.findAll();

      expect(movies).toEqual([movie]);
    });
  });

  describe("findOneMovie", () => {
    it('should be able to list one movie', async () => {
      const requestedMovie = await controller.findOne(3);

      expect(requestedMovie).toEqual(movie);
    });
  });

  describe("updateMovie", () => {
    it('should be able to update a movie', async () => {
      const updateMovieDto = {
        title: "updated test title",
        description: "test description",
        director: "test director",
        releaseDate: new Date('2001-01-01'),
        rating: 1,
        imageUrl: "test image url",
      };

      await expect(controller.update(99, updateMovieDto)).resolves.toEqual({
        id: 99,
        ...updateMovieDto
      });
    });
  });
});
