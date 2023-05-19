import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinDate,
  ValidateNested,
} from 'class-validator';
import * as dayjs from 'dayjs';

class RequestEquipmentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  equipment: number;
}

class AddressDto {
  @IsString({ message: 'Название города должно быть строкой.' })
  @MaxLength(50, { message: 'Длина названия города должна быть до $constraint1 символов.' })
  @IsNotEmpty({ message: 'Укажите город.' })
  city: string;

  @IsString({ message: 'Название улицы должно быть строкой.' })
  @MaxLength(50, { message: 'Длина названия улицы должна быть до $constraint1 символов.' })
  @IsNotEmpty({ message: 'Укажите улицу.' })
  street: string;

  @IsString({ message: 'Номер дома должен быть строкой.' })
  @MaxLength(50, { message: 'Длина номера дома должна быть до $constraint1 символов.' })
  @IsNotEmpty({ message: 'Укажите номер дома.' })
  house: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  flat: number | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lat: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lon: string;
}

export class CreateRequestDto {
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(dayjs().subtract(1, 'day').endOf('day').toDate(), { message: 'Недопустимая дата монтажа.' })
  @IsNotEmpty({ message: 'Укажите дату монтажа.' })
  mountingDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stage: number;

  @IsNotEmpty({ message: 'Адрес.' })
  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;

  @IsNotEmpty()
  @Type(() => RequestEquipmentDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  requestEquipment: RequestEquipmentDto[];
}
