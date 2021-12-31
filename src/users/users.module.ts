import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie]), MoviesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
