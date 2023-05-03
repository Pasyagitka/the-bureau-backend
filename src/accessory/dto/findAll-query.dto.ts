import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginatedQuery } from '../../common/pagination/paginated-query.dto';

export class FindAllQueryDto extends PaginatedQuery {
  @ApiPropertyOptional({ default: 0, type: [Number], format: 'form' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value?.trim().split(',').map(Number))
  equipmentId?: number[];

  @ApiPropertyOptional({ description: 'Search' })
  @IsOptional()
  @Transform(({ value }) => (value && value?.trim()) || null)
  @IsString()
  search: string;
}
