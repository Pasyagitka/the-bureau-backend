import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  activationLink: string; //TODO activation link??
}
