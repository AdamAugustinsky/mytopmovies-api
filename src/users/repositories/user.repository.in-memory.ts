import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterOptions = { email: string };

export class UserInMemoryRepository {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();

    Object.assign(user, createUserDto);

    return Promise.resolve(user);
  }

  save(user: User): Promise<User> {
    user.id = this.users.length + 1;

    this.users.push(user);

    return Promise.resolve(user);
  }

  findOne(filter?: number | FilterOptions): Promise<User> {
    if (typeof filter == 'number')
      return Promise.resolve(
        this.users.find((user: User) => user.id == filter),
      );

    return Promise.resolve(
      this.users.find((user: User) => user.email == filter.email),
    );
  }

  find(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  merge(persistedUser: User, updateUserDto: UpdateUserDto): Promise<User> {
    const index = this.users.findIndex((user) => user.id == persistedUser.id);

    Object.assign(persistedUser, updateUserDto);

    this.users[index] = persistedUser;

    return Promise.resolve(persistedUser);
  }

  delete(id: number): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id == id);

    this.users.splice(index);

    return Promise.resolve(true);
  }
}
