import { Role } from 'src/auth/enum/role.enum';

export class UserDto {
  id: number;
  login: string;
  role: Role;
}
