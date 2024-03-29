import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RequestAccessoryResponseDto {
  @Expose()
  sku: string;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  constructor(partial: Partial<RequestAccessoryResponseDto>) {
    Object.assign(this, partial);
  }
}
