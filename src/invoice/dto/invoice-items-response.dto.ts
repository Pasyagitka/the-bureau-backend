import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class InvoiceItemAccessoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  sku?: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity_in_stock: number;
}

@Exclude()
export class InvoiceItemsResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => InvoiceItemAccessoryResponseDto)
  accessory: InvoiceItemAccessoryResponseDto;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  sum: number;

  constructor(partial: Partial<InvoiceItemsResponseDto>) {
    Object.assign(this, partial);
  }
}
