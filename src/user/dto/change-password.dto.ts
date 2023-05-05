import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  newPassword: string;
}
