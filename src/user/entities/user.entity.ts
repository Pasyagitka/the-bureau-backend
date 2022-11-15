import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('user_pkey', ['id'], { unique: true })
@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'login', unique: true })
  login: string;

  @Column('text', { name: 'email', unique: true })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('text', { name: 'resetPasswordLink', nullable: true })
  resetPasswordLink: string | null;

  @Column('text', { name: 'activationLink', nullable: true })
  activationLink: string | null;

  @Column('text', { name: 'temporaryPassword', nullable: true })
  temporaryPassword: string | null;

  @Column('boolean', { name: 'isActivated', default: () => 'false' })
  isActivated: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
  role: Role;

  @DeleteDateColumn()
  deletedAt?: Date;
}
