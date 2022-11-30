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
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsAfterConstraint } from 'src/common/validators/after-date/validate.after-date';

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
  clientDateStart: Date;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @Validate(IsAfterConstraint, ['clientDateStart'])
  @IsNotEmpty()
  clientDateEnd: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stage: number;

  // @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  // client: number;

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
