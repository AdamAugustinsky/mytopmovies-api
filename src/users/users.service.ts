import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isEmailAlreadyInUse: User = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (isEmailAlreadyInUse)
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);

    let createdUser: User = new User();

    Object.assign(createdUser, createUserDto);
    createdUser.movies = await this.moviesRepository.findByIds(
      createUserDto.movies_ids,
    );

    createdUser = await this.userRepository.create(createdUser);

    this.userRepository.save(createdUser);

    return createdUser;
  }

  findAll(): Promise<User[]> {
    return null;
  }

  findOne(id: number): Promise<User> {
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return null;
  }

  remove(id: number): Promise<void> {
    return null;
  }
}
