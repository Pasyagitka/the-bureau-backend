import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Index('user_pkey', ['id'], { unique: true })
@Entity('user', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'login' })
  login: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('text', { name: 'resetPasswordLink', nullable: true })
  resetPasswordLink: string | null;

  @Column('text', { name: 'activationLink', nullable: true })
  activationLink: string | null;

  @Column('text', { name: 'temporaryPassword', nullable: true })
  temporaryPassword: string | null;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @Column('boolean', { name: 'isActivated', default: () => 'false' })
  isActivated: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
  role: Role;
}
