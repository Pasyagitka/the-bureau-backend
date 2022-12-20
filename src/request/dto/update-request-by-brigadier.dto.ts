import { IsEnum, NotEquals } from 'class-validator';
import { RequestStatus } from '../types/request-status.enum';

export class UpdateRequestByBrigadierDto {
  @IsEnum(RequestStatus)
  @NotEquals(RequestStatus.APPROVED)
  status: RequestStatus;
}
