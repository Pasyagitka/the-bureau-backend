import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsNumber, IsPositive } from 'class-validator';

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
}
