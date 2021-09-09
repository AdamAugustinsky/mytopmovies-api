import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
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

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
