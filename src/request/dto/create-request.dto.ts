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
  country: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  city: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  house: number;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  corpus: string | null;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  flat: number | null;
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
