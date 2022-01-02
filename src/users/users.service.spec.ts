import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { MovieInMemoryRepository } from '../movies/repositories/movie.repository.in-memory';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInMemoryRepository } from './repositories/user.repository.in-memory';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const createUserDto = {
    email: 'outroteste@email.com',
    username: 'teste',
    password: 'verysafepassword',
    movies_ids: [1],
  };

  const movie: Movie = new Movie();
  movie.title = 'test title';
  movie.description = 'test description';
  movie.director = 'test director';
  movie.rating = 3;
  movie.releaseDate = new Date();
  movie.imageUrl = 'test image url';

  beforeEach(async () => {
    const userInMemoryRepository = new UserInMemoryRepository();

    const movieInMemoryRepository = new MovieInMemoryRepository();

    movieInMemoryRepository.save(movie);

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be able to create a user', async () => {
      await expect(service.create(createUserDto)).resolves.toEqual({
        id: 1,
        ...createUserDto,
        movies: [{ id: 1 }],
      });
    });

    it('should not be able to create a user when email is already in use', async () => {
      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  describe('findUsers', () => {
    it('should be able to list all users', async () => {
      await service.create(createUserDto);

      await expect(service.findAll()).resolves.toEqual([
        {
          id: 1,
          ...createUserDto,
          movies: [{ id: 1 }],
        },
      ]);
    });
  });

  describe('findUser', () => {
    it('should be able to list one user', async () => {
      await service.create(createUserDto);

      await expect(service.findOne(1)).resolves.toEqual({
        id: 1,
        ...createUserDto,
        movies: [{ id: 1 }],
      });
    });

    it('should not be able to list non existent user  ', async () => {
      await expect(service.findOne(-1)).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('updateUser', () => {
    it('should be able to update user', async () => {
      const updateUserDto = {
        email: 'outroteste@email.com',
        username: 'teste',
        password: 'verysafepassword',
        movies_ids: [1],
      };
      await service.create(createUserDto);

      await expect(service.update(1, updateUserDto)).resolves.toEqual({
        id: 1,
        ...updateUserDto,
        movies: [{ id: 1 }],
      });
    });

    it('should not be able to update non existent user  ', async () => {
      await expect(
        service.update(-1, new UpdateUserDto()),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('deleteUser', () => {
    it('should be able to delete user', async () => {
      await service.create(createUserDto);

      await expect(service.remove(1)).toBeTruthy();
    });

    it('should not be able to delete non existent user  ', async () => {
      await expect(service.remove(-1)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
