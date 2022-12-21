import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { RequestStatus } from '../types/request-status.enum';

export class UpdateRequestByAdminDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  brigadier?: number;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
