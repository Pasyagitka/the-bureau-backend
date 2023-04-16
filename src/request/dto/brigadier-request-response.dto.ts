import { Exclude, Expose, Type } from 'class-transformer';
import { BrigadierResponseDto } from '../../brigadier/dto/brigadier-response.dto';
import { ClientResponseDto } from '../../client/dto/client-response.dto';
import { EquipmentResponseDto } from '../../equipment/dto/equipment-response.dto';
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
  city: string;

  @Expose()
  street: string;

  @Expose()
  house: string;

  @Expose()
  flat: number;

  @Expose()
  lat: string;

  @Expose()
  lon: string;
}

@Exclude()
export class StageResponseDto {
  @Expose()
  id: number;

  @Expose()
  stage: string;

  @Expose()
  mountingPrice?: number;

  constructor(partial: Partial<StageResponseDto>) {
    Object.assign(this, partial);
  }
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
