import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EquipmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  type: string;

  @Expose()
  mounting: string;

  constructor(partial: Partial<EquipmentResponseDto>) {
    Object.assign(this, partial);
  }
}
