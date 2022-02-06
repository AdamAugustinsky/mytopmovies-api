import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResponseAuthDto } from './dto/response-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async isValidUser(loginDto: LoginAuthDto): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: loginDto.email });
    if (!user) return false;
    return bcrypt.compare(loginDto.password, user.password);
  }

  async login(loginDto: LoginAuthDto): Promise<ResponseAuthDto> {
    if (!(await this.isValidUser(loginDto)))
      throw new HttpException('Credentials not valid', HttpStatus.UNAUTHORIZED);

    return { token: this.jwtService.sign(loginDto) };
  }
}
