import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class RecommendedQuery {
  @ApiProperty({ default: new Date() })
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
