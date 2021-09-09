import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
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
