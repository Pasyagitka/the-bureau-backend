import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from '../../auth/enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Укажите логин.' })
  @IsString({ message: 'Логин должен быть строкой.' })
  @Length(3, 30, { message: 'Длина логина должна быть от $constraint1 до $constraint2 символов.' })
  login: string;

  @IsNotEmpty({ message: 'Укажите email.' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Укажите пароль.' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, 50, { message: 'Длина пароля должна быть от $constraint1 до $constraint2 символов.' })
  password: string;

  //@IsEnum(Role)
  role?: Role;

  //@IsString()
  activationLink?: string;
}
