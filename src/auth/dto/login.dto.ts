import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Укажите логин.' })
  @IsString()
  login: string;

  @IsNotEmpty({ message: 'Укажите пароль.' })
  @IsString()
  password: string;
}
