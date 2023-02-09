import { Exclude, Expose, Type } from 'class-transformer';
import { EquipmentResponseDto } from '../../equipment/dto/equipment-response.dto';

@Exclude()
export class AccessoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  sku?: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  @Type(() => EquipmentResponseDto)
  equipment: EquipmentResponseDto;

  constructor(partial: Partial<AccessoryResponseDto>) {
    Object.assign(this, partial);
  }
}
