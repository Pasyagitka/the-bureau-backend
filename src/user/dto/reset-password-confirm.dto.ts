import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordConfirmDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  temporaryPassword: string;

  @IsNotEmpty()
  @IsString()
  resetPasswordLink: string;
}
