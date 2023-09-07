import { IsJSON, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrigadierDto extends CreateUserDto {
  @IsNotEmpty({ message: 'Укажите имя.' })
  @IsString({ message: 'Имя должно быть строкой.' })
  @Length(2, 30, { message: 'Длина имени должна быть от $constraint1 до $constraint2 символов.' })
  firstname: string;

  @IsNotEmpty({ message: 'Укажите фамилию.' })
  @IsString({ message: 'Фамилия должна быть строкой.' })
  @Length(3, 30, { message: 'Длина фамилии должна быть от $constraint1 до $constraint2 символов.' })
  surname: string;

  @IsNotEmpty({ message: 'Укажите отчество.' })
  @IsString({ message: 'Отчество должно быть строкой.' })
  @Length(3, 30, { message: 'Длина отчества должна быть от $constraint1 до $constraint2 символов.' })
  patronymic: string;

  @ApiProperty({ example: '375297645364' })
  @IsNotEmpty({ message: 'Укажите номер телефона.' })
  @IsPhoneNumber('BY', { message: 'Номер телефона должен быть в формате 375( )___-__-__.' })
  contactNumber: string;

  @ApiProperty({ example: `{\"instagram\": \"https://www.instagram.com/\"}` })
  @IsOptional()
  @IsString()
  @IsJSON()
  socialLinks?: string;
}
