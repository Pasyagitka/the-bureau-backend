import { Exclude, Expose, Type } from 'class-transformer';
import { BrigadierResponseDto } from 'src/brigadier/dto/brigadier-response.dto';
import { ClientResponseDto } from 'src/client/dto/client-response.dto';
import { EquipmentResponseDto } from 'src/equipment/dto/equipment-response.dto';
import { RequestAccessoryResponseDto } from './request-accessory-response.dto';
import { RequestToolResponseDto } from './request-tool-response.dto';

@Exclude()
export class RequestEquipmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => EquipmentResponseDto)
  equipment: EquipmentResponseDto;
}

@Exclude()
export class AddressResponseDto {
  @Expose()
  id: number;

  @Expose()
  country: string;

  @Expose()
  city: string;

  @Expose()
  street: string;

  @Expose()
  house: number;

  @Expose()
  corpus: string;

  @Expose()
  flat: number;
}

@Exclude()
export class StageResponseDto {
  @Expose()
  id: number;

  @Expose()
  stage: string;
}

@Exclude()
export class BrigadierRequestResponseDto {
  @Expose()
  id: number;

  @Expose()
  registerDate: string;

  @Expose()
  mountingDate: string;

  @Expose()
  comment: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => StageResponseDto)
  stage: StageResponseDto;

  @Expose()
  @Type(() => AddressResponseDto)
  address: AddressResponseDto;

  @Expose()
  @Type(() => BrigadierResponseDto)
  brigadier: BrigadierResponseDto;

  @Expose()
  @Type(() => RequestEquipmentResponseDto)
  requestEquipment: Array<RequestEquipmentResponseDto>;

  @Expose()
  @Type(() => RequestAccessoryResponseDto)
  requestAccessories: Array<RequestAccessoryResponseDto>;

  @Expose()
  @Type(() => RequestToolResponseDto)
  requestTools: Array<RequestToolResponseDto>;

  constructor(partial: Partial<BrigadierRequestResponseDto>) {
    Object.assign(this, partial);
  }
}
