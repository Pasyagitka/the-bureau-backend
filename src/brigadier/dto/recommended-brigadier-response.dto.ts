import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecommendedBrigadierResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  week_request_count: number;

  constructor(partial: Partial<RecommendedBrigadierResponseDto>) {
    Object.assign(this, partial);
  }
}
