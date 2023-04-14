import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StatisticsResponseDto {
  @Expose()
  count: number;

  constructor(partial: Partial<StatisticsResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class RequestStatisticsResponseDto {
  @Expose()
  count: number;

  constructor(partial: Partial<RequestStatisticsResponseDto>) {
    Object.assign(this, partial);
  }
}
