import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateBrigadierDto extends CreateUserDto {
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
