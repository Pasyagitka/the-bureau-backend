import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RequestReportResponseDto {
  @Expose()
  id: number;

  @Expose()
  url: string;

  @Expose()
  requestId: number;

  constructor(partial: Partial<RequestReportResponseDto>) {
    Object.assign(this, partial);
  }
}
