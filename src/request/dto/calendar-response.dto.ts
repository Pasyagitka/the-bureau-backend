import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CalendarResponseDto {
  @Expose()
  mountingDate: string;

  @Expose()
  brigadierId: number;

  @Expose()
  brigadier: string;

  @Expose()
  requestId: number;

  @Expose()
  status: number;

  constructor(partial: Partial<CalendarResponseDto>) {
    Object.assign(this, partial);
  }
}
