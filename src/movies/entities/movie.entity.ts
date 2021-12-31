import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  director: string;

  @Column()
  @ApiProperty()
  releaseDate: Date;

  @Column()
  @ApiProperty()
  rating: number;

  @Column()
  @ApiProperty()
  imageUrl: string;
}
