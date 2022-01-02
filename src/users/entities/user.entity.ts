import { Movie } from '../../movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToMany(() => Movie)
  @JoinTable({
    name: 'users_movies',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'movie_id',
    },
  })
  @ApiProperty({ type: Movie, isArray: true })
  movies: Movie[];
}
