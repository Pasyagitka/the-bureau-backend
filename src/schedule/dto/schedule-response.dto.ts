import { Exclude, Expose, Transform } from 'class-transformer';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Request } from '../../request/entities/request.entity';

@Exclude()
export class ScheduleResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => value && value.id)
  brigadier: Brigadier;

  @Expose()
  @Transform(({ value }) => value && value.id)
  request: Request;

  constructor(partial: Partial<ScheduleResponseDto>) {
    Object.assign(this, partial);
  }
}
