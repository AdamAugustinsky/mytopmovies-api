import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = await this.moviesRepository.create(createMovieDto);

    this.moviesRepository.save(createdMovie);

    return createdMovie;
  }

  async findAll(): Promise<Movie[]> {
    const movies: Movie[] = await this.moviesRepository.find();
    return movies;
  }

  async findOne(id: number): Promise<Movie> {
    return await this.moviesRepository.findOne(id);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.findOne(id);
    
    Object.assign(movie, updateMovieDto);

    const updatedMovie = await this.moviesRepository.save(movie);

    return updatedMovie;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
