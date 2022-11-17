import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/base/entities/base.entity';
import { Role } from 'src/auth/enum/role.enum';

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

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Client,
  })
  role: Role;

  @DeleteDateColumn()
  deletedAt?: Date;
}
