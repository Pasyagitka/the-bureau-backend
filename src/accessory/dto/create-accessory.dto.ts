import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateAccessoryDto {
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(50)
  @IsOptional()
  sku?: string | null;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  equipmentId: number;

  @ApiProperty()
  //@IsPositive()
  @IsDecimal()
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;
}
