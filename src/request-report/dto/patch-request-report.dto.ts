import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PatchRequestReportDto {
  @ApiProperty()
  @IsString()
  url: Express.Multer.File;
}
