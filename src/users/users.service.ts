import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): Promise<User> {
    return null;
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
