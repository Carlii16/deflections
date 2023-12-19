import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { SigninUserDto } from 'src/dtos/signin-user.dto';
import { promisify } from 'util';
import { UserService } from './user.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(createUser: CreateUserDto) {
    console.log('Received request to sign up:', createUser);

    const { email, password, lastName, firstName } = createUser;
    const users = await this.userService.findOneByEmail(email);

    if (users) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.userService.create({
      email,
      password: result,
      lastName,
      firstName,
    });

    console.log('User signed up successfully:', user);

    return user;
  }

  async signin(signinDto: SigninUserDto) {
    const { email, password } = signinDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hashedBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const hashedInputPassword = hashedBuffer.toString('hex');

    if (storedHash === hashedInputPassword) {
      return user;
    } else {
      throw new BadRequestException('Invalid password');
    }
  }
}
