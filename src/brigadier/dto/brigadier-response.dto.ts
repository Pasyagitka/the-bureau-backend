import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class BrigadierResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstname: string;

  @Expose()
  surname: string;

  @Expose()
  patronymic: string;

  @Expose()
  contactNumber: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<BrigadierResponseDto>) {
    Object.assign(this, partial);
  }
}
