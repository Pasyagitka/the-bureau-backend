import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';

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

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  constructor(partial: Partial<ClientResponseDto>) {
    Object.assign(this, partial);
  }
}
