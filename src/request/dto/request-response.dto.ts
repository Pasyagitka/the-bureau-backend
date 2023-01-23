import { Exclude, Expose, Type } from 'class-transformer';
import { BrigadierResponseDto } from '../../brigadier/dto/brigadier-response.dto';
import { ClientResponseDto } from '../../client/dto/client-response.dto';
import { AddressResponseDto, StageResponseDto } from './brigadier-request-response.dto';

@Exclude()
export class RequestResponseDto {
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
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => AddressResponseDto)
  address: AddressResponseDto;

  @Expose()
  @Type(() => BrigadierResponseDto)
  brigadier: BrigadierResponseDto;

  @Expose()
  @Type(() => StageResponseDto)
  stage: StageResponseDto;

  constructor(partial: Partial<RequestResponseDto>) {
    Object.assign(this, partial);
  }
}
