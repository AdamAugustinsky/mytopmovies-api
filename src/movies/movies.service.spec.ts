import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovie: Movie = new Movie();
  mockMovie.id = 0;
  mockMovie.title = "test title";
  mockMovie.description = "test description";
  mockMovie.director = "test director";
  mockMovie.imageUrl = "http://en.wikipedia.org/wiki/File:Ada_lovelace.jpg";
  mockMovie.releaseDate = new Date('2001-01-01');
  mockMovie.rating = 5;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            create: jest.fn().mockResolvedValueOnce(mockMovie),
            save: jest.fn().mockResolvedValueOnce(mockMovie),
            find: jest.fn().mockResolvedValueOnce([mockMovie]),
          }
        }
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a movie', async () => {
    const createdMovie = await service.create({
      title: "teste",
      description: "test description",
      director: "test director",
      releaseDate: new Date(),
      rating: 0,
      imageUrl: "http://en.wikipedia.org/wiki/File:Ada_lovelace.jpg"
    })

    expect(createdMovie).toBeInstanceOf(Movie);
  });
});
