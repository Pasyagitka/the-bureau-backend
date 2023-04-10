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
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  city: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
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
  @MinDate(new Date())
  @IsNotEmpty()
  mountingDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stage: number;

  @IsNotEmpty()
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
