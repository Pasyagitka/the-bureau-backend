import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertRequestReportDto {
  @ApiProperty()
  @IsString()
  file: string;
}
