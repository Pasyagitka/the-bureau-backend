import { Exclude, Expose, Transform } from 'class-transformer';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';

@Exclude()
export class InvoiceResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => value && `${value.firstname} ${value.patronymic} ${value.surname}`)
  customer: Brigadier;

  @Expose()
  total: number;

  @Expose()
  status: string;

  @Expose()
  receiptUrl: string;

  constructor(partial: Partial<InvoiceResponseDto>) {
    Object.assign(this, partial);
  }
}
