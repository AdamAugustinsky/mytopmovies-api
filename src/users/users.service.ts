import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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

    createdUser.password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );

    createdUser = await this.userRepository.create(createdUser);

    this.userRepository.save(createdUser);

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['movies'] });
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne(id, {
      relations: ['movies'],
    });

    if (!user)
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    updateUserDto.password = await bcrypt.hash(
      updateUserDto.password,
      await bcrypt.genSalt(),
    );

    const updatedUser = await this.userRepository.merge(user, updateUserDto);

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }
}
