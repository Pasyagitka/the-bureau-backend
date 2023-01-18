import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScheduleResponseDto {
  @Expose()
  id: number;

  @Expose()
  brigadierId: number;

  @Expose()
  requestId: number;

  constructor(partial: Partial<ScheduleResponseDto>) {
    Object.assign(this, partial);
  }
}
