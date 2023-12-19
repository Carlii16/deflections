import { IsEmail, IsString } from 'class-validator';
import { CreateUserInput } from 'src/interface/input/create-user-input';

export class CreateUserDto implements CreateUserInput {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  lastName: string;
  @IsString()
  firstName: string;
}
