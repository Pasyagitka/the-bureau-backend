import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, MinDate } from 'class-validator';
import { RequestStatus } from '../types/request-status.enum';

export class UpdateRequestByAdminDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  brigadier?: number;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @IsOptional()
  mountingDate?: Date;
}
