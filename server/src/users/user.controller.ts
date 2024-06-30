import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'server/src/dtos/create-user.dto';
import { SigninUserDto } from 'server/src/dtos/signin-user.dto';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthGuard } from 'server/src/guards/auth.guard';

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
    const { token } = await this.authService.signin(signinDto);
    return { token };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllUsers() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id, 10));
  }

  @Delete('signout/:id')
  @UseGuards(AuthGuard)
  async signoutUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);

    const signoutMessage = await this.authService.signout(userId);
    return signoutMessage;
  }
}
