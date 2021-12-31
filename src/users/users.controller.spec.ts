import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { MovieInMemoryRepository } from '../movies/repositories/movie.repository.in-memory';
import { User } from './entities/user.entity';
import { UserInMemoryRepository } from './repositories/user.repository.in-memory';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const userInMemoryRepository = new UserInMemoryRepository();

    const movieInMemoryRepository = new MovieInMemoryRepository();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userInMemoryRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: movieInMemoryRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should be able to create a user', async () => {
      const createUserDto = {
        email: 'outroteste@email.com',
        username: 'teste',
        password: 'verysafepassword',
        movies_ids: [],
      };

      await expect(controller.create(createUserDto)).resolves.toEqual({
        id: 1,
        ...createUserDto,
        movies: [],
      });
    });

    it('should not be able to create a user when email is already in use', async () => {
      const createUserDto = {
        email: 'outroteste@email.com',
        username: 'teste',
        password: 'verysafepassword',
        movies_ids: [],
      };

      await controller.create(createUserDto);

      await expect(controller.create(createUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });
});
