import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  director: string;
  @ApiProperty()
  releaseDate: Date;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  imageUrl: string;
}
