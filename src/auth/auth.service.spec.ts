import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hash as bcryptHash, genSalt as bcryptGenSalt } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserInMemoryRepository } from '../users/repositories/user.repository.in-memory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userInMemoryRepository = new UserInMemoryRepository();

    const testUser: CreateUserDto = {
      email: 'teste@email.com',
      username: 'teste',
      password: 'verysafepassword',
      movies_ids: [],
    };

    testUser.password = await bcryptHash(
      testUser.password,
      await bcryptGenSalt(),
    );

    const createdUser: User = await userInMemoryRepository.create(testUser);

    await userInMemoryRepository.save(createdUser);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testsecret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should be able to login', async () => {
      const loginDto: LoginAuthDto = {
        email: 'teste@email.com',
        password: 'verysafepassword',
      };

      await expect(service.login(loginDto)).resolves.toHaveProperty('token');
    });

    it('should not be able to login with wrong credentials', async () => {
      const loginDto: LoginAuthDto = {
        email: 'teste@email.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        HttpException,
      );
    });

    it('should not be able to login with non-existent user', async () => {
      const loginDto: LoginAuthDto = {
        email: 'asdfjsdaofijasdf@email.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });
});
