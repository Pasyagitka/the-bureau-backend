import { USER_REPOSITORY } from 'src/common/constants';
import { User } from '../user/entities/user.entity';

export const categoriesProviders = [
  { provide: USER_REPOSITORY, useValue: User },
];
