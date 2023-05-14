import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class StatisticsQuery {
  @ApiPropertyOptional({ default: new Date() })
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @IsOptional()
  month: Date;
}
