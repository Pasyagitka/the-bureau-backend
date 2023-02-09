import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBooleanString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class RentalQueryDto {
  // @ApiPropertyOptional({ default: false })
  // @IsBooleanString()
  // @IsOptional()
  // isApproved?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  brigadierId?: number;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  toolId?: number;
}
