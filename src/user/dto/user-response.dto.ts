import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  login: string;

  @Expose()
  email: string;

  password: string;

  @Expose()
  role: string;
}
