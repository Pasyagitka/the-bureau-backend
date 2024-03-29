import { Exclude, Expose } from 'class-transformer';
import { ClientResponseDto } from '../../client/dto/client-response.dto';
import { AddressResponseDto, RequestEquipmentResponseDto, StageResponseDto } from './brigadier-request-response.dto';
import { BrigadierResponseDto } from '../../brigadier/dto/brigadier-response.dto';

@Exclude()
export class ClientRequestResponseDto {
  @Expose()
  id: number;

  @Expose()
  registerDate: Date;

  @Expose()
  mountingDate: Date;

  @Expose()
  comment: string;

  @Expose()
  status: string;

  @Expose()
  client: ClientResponseDto;

  @Expose()
  stage: StageResponseDto;

  @Expose()
  address: AddressResponseDto;

  @Expose()
  brigadier: BrigadierResponseDto;

  @Expose()
  requestEquipment: Array<RequestEquipmentResponseDto>;

  constructor(partial: Partial<ClientRequestResponseDto>) {
    Object.assign(this, partial);
  }
}
