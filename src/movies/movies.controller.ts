import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from './entities/movie.entity';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiResponse({ status: 201, type: Movie })
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: Movie, isArray: true })
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Movie })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'Movie with id _ not found',
      },
    },
  })
  findOne(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Movie })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'Movie with id _ not found',
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'Movie with id _ not found',
      },
    },
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(+id);
  }
}
