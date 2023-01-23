import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from '../../auth/enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  //@IsEnum(Role)
  role?: Role;

  //@IsString()
  activationLink?: string;
}
