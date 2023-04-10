import { Exclude, Expose, Transform } from 'class-transformer';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';

@Exclude()
export class RequestScheduleResponseDto {
  @Expose()
  @Transform(({ value }) => value && `(№${value.id}) ${value.surname} ${value.firstname} ${value.patronymic}`)
  brigadier: Brigadier;

  @Expose()
  modifiedDate: Date;

  constructor(partial: Partial<RequestScheduleResponseDto>) {
    Object.assign(this, partial);
  }
}
