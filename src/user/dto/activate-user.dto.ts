import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;

  @IsNotEmpty()
  @IsString()
  activationLink: string;
}
