import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BrigadierTopListResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  request_count: number;

  constructor(partial: Partial<BrigadierTopListResponseDto>) {
    Object.assign(this, partial);
  }
}
