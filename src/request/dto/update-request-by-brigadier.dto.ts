import { IsEnum, NotEquals } from 'class-validator';
import { RequestStatus } from '../entities/request.entity';

export class UpdateRequestByBrigadierDto {
  @IsEnum(RequestStatus)
  @NotEquals(RequestStatus.APPROVED)
  status: RequestStatus;
}
