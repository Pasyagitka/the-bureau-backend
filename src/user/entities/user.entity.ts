import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/enum/role.enum';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Client } from '../../client/entities/client.entity';

@Index('user_pkey', ['id'], { unique: true })
@Entity('user')
export class User {
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

  @OneToOne(() => Client, (client) => client.user)
  client: Client;

  @OneToOne(() => Brigadier, (brigadier) => brigadier.user)
  brigadier: Brigadier;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
