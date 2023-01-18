import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClientResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstname: string;

  @Expose()
  surname: string;

  @Expose()
  contactNumber: string;

  @Expose()
  patronymic: string;

  constructor(partial: Partial<ClientResponseDto>) {
    Object.assign(this, partial);
  }
}
