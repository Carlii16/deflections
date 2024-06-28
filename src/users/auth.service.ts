import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { JWT_SECRET_KEY } from 'src/config';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { SigninUserDto } from 'src/dtos/signin-user.dto';
import { promisify } from 'util';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private readonly secretKey: string;
  constructor(private userService: UserService) {
    this.secretKey = JWT_SECRET_KEY;
  }

  async signup(createUser: CreateUserDto) {
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
      const payload = {
        email: user.email,
        sub: user.id,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, this.secretKey, { algorithm: 'HS256' });

      user.token = token;
      await this.userService.updateToken(user.id, token);

      return { user, token };
    } else {
      throw new BadRequestException('Invalid password');
    }
  }

  async signout(userId: number) {
    const user = await this.userService.findOne(userId);
    console.log('Signin function called with:', userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return { message: `User with ID ${userId} has been signed out.` };
  }
}
