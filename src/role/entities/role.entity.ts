import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Index('role_pkey', ['id'], { unique: true })
@Entity('role', { schema: 'public' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'role' })
  role: string;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
