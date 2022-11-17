import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateBrigadierDto {
  @IsString()
  @Length(3, 30)
  firstname: string;

  @IsString()
  @Length(3, 30)
  surname: string;

  @IsString()
  @Length(3, 30)
  patronymic: string;

  @IsPhoneNumber('BY')
  @IsNotEmpty()
  contactNumber: string;
}
