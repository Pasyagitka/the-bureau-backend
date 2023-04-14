import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PatchRequestReportDto {
  @ApiProperty()
  @IsString()
  file: Express.Multer.File;
}
