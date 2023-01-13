import { Exclude, Expose, Type } from 'class-transformer';

class UserDto {
  id: number;
  login: string;
  email: string;
  //password
  role: string;
}

class ClientDto {
  id: number;
  firstname: string;
  surname: string;
  patronymic: string;
  contactNumber: string;
  @Exclude()
  user: UserDto;
}

class AddressDto {
  id: number;
  country: string;
  city: string;
  street: string;
  house: number;
  corpus: string;
  flat: number;
}

class BrigadierDto {
  id: number;
  firstname: string;
  surname: string;
  patronymic: string;
  contactNumber: string;
  user: UserDto;
}

class StageDto {
  id: number;
  stage: string;
}

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
  @Type(() => ClientDto)
  client: ClientDto;

  @Expose()
  @Type(() => AddressDto)
  address: AddressDto;

  @Expose()
  @Type(() => BrigadierDto)
  brigadier: BrigadierDto;

  @Expose()
  @Type(() => StageDto)
  stage: StageDto;

  constructor(partial: Partial<RequestResponseDto>) {
    Object.assign(this, partial);
  }
}
