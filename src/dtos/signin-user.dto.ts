import { IsEmail, IsString } from 'class-validator';
import { SigninUserInput } from 'src/interface/input/signin-user-input';

export class SigninUserDto implements SigninUserInput {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
