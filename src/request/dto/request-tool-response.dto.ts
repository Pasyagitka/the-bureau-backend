import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RequestToolResponseDto {
  @Expose()
  name: string;

  constructor(partial: Partial<RequestToolResponseDto>) {
    Object.assign(this, partial);
  }
}
