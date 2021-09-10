import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

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
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            create: jest.fn((createMovieDto: CreateMovieDto) => {
              const newMovie: Movie = new Movie();

              newMovie.id = 1;
              newMovie.title = createMovieDto.title;
              newMovie.description = createMovieDto.description;
              newMovie.director = createMovieDto.director;
              newMovie.rating = createMovieDto.rating;
              newMovie.releaseDate = createMovieDto.releaseDate;
              newMovie.imageUrl = createMovieDto.imageUrl;

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

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      await expect(service.create(createMovieDto)).resolves.toEqual({
        id: 1,
        ...createMovieDto
      });
    });
  });

  describe("findMovies", () => {
    it('should be able to list all movies', async () => {
      const movies = await service.findAll();

      expect(movies).toEqual([movie]);
    });
  });

  describe("findOneMovie", () => {
    it('should be able to list all movies', async () => {
      const requestedMovie = await service.findOne(3);

      expect(requestedMovie).toEqual(movie);
    });
  });
});
