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
export class LabelStatisticsResponseDto {
  @Expose()
  count: number;

  @Expose()
  label: string;

  constructor(partial: Partial<LabelStatisticsResponseDto>) {
    Object.assign(this, partial);
  }
}
