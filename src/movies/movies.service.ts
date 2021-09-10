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

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
