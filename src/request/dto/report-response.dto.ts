import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReportResponseDto {
  @Expose()
  day: string;

  @Expose()
  brigadierId: number;

  @Expose()
  count: number;

  constructor(partial: Partial<ReportResponseDto>) {
    Object.assign(this, partial);
  }
}
