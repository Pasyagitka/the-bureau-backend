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

  constructor(partial: Partial<InvoiceResponseDto>) {
    Object.assign(this, partial);
  }
}
