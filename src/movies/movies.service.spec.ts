import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be able to create a movie', () => {
    const createdMovie = service.create({
      title: "teste",
      description: "test description",
      director: "test director",
      releaseDate: new Date(),
      rating: 0,
      imageUrl: "http://en.wikipedia.org/wiki/File:Ada_lovelace.jpg"
    })
    expect(createdMovie).toHaveProperty('id');
  });
});
