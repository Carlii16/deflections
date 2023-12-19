import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { SigninUserDto } from 'src/dtos/signin-user.dto';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    return user;
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninUserDto) {
    const user = await this.authService.signin(signinDto);
    return user;
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id, 10));
  }
}
