import { Exclude, Expose } from 'class-transformer';
import { BrigadierResponseDto } from 'src/brigadier/dto/brigadier-response.dto';
import { ClientResponseDto } from 'src/client/dto/client-response.dto';
import { AddressResponseDto, RequestEquipmentResponseDto, StageResponseDto } from './brigadier-request-response.dto';

@Exclude()
export class ClientRequestResponseDto {
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
