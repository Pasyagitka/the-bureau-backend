import { IsEnum, IsOptional, NotEquals } from 'class-validator';
import { RequestStatus } from '../types/request-status.enum';

export class UpdateRequestByBrigadierDto {
  @IsEnum(RequestStatus)
  @NotEquals(RequestStatus.APPROVED)
  @NotEquals(RequestStatus.INPROCESSING)
  @IsOptional()
  status?: RequestStatus;
}
