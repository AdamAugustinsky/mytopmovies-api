import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            create: jest.fn((createMovieDto: CreateMovieDto) => {
              const movie: Movie = new Movie();

              movie.id = 1;
              movie.title = createMovieDto.title;
              movie.description = createMovieDto.description;
              movie.director = createMovieDto.director;
              movie.rating = createMovieDto.rating;
              movie.releaseDate = createMovieDto.releaseDate;
              movie.imageUrl = createMovieDto.imageUrl;

              return Promise.resolve(movie);
            }),
            save: jest.fn((movie: Movie) => Promise.resolve(movie)),
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
  })
});
