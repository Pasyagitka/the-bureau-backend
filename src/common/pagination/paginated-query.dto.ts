import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginatedQuery {
  @ApiProperty({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;
}
