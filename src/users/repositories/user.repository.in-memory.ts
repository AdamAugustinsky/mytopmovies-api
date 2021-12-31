import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterOptions = any;

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

  findOne(filter: FilterOptions): Promise<User> {
    if (filter instanceof Number)
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
}
