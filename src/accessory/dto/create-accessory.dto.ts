import { IsString, MaxLength, IsOptional, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateAccessoryDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  sku: string | null;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  equipmentId: number;
}
