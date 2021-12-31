import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Movie } from '../entities/movie.entity';

export class MovieInMemoryRepository {
  private movies: Movie[] = [];

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie: Movie = new Movie();

    Object.assign(movie, createMovieDto);

    return Promise.resolve(movie);
  }

  save(movie: Movie): Promise<Movie> {
    movie.id = this.movies.length + 1;

    this.movies.push(movie);

    return Promise.resolve(movie);
  }

  find(): Promise<Movie[]> {
    return Promise.resolve(this.movies);
  }

  findOne(id: number): Promise<Movie> {
    return Promise.resolve(this.movies.find((movie: Movie) => movie.id == id));
  }

  findByIds(ids: number[]): Promise<Movie[]> {
    const moviesFound: Movie[] = [];
    ids.forEach(async (id) => moviesFound.push(await this.findOne(id)));
    return Promise.resolve(moviesFound);
  }

  merge(persistedMovie: Movie, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const index = this.movies.findIndex(
      (movie) => movie.id == persistedMovie.id,
    );

    Object.assign(persistedMovie, updateMovieDto);

    this.movies[index] = persistedMovie;

    return Promise.resolve(persistedMovie);
  }

  delete(id: number): Promise<boolean> {
    const index: number = this.movies.findIndex((movie) => movie.id == id);

    if (this.movies.splice(index)) Promise.resolve(true);
    return Promise.resolve(false);
  }
}
