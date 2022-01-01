import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';

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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne(id);

    if (!user)
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return null;
  }

  remove(id: number): Promise<void> {
    return null;
  }
}
