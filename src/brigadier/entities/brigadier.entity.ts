import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Request } from '../../request/entities/request.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../user/entities/user.entity';

@Index('brigadier_pkey', ['id'], { unique: true })
@Entity('brigadier')
export class Brigadier {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'firstname' })
  firstname: string;

  @Column('text', { name: 'surname' })
  surname: string;

  @Column('text', { name: 'patronymic' })
  patronymic: string;

  @Column('text', { name: 'contactNumber' })
  contactNumber: string;

  @Column('boolean', { name: 'isApproved', default: () => 'false' })
  isApproved: boolean;

  @OneToOne(() => User, (user) => user.brigadier, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Request, (request) => request.brigadier, { cascade: true, onDelete: 'SET NULL' })
  requests: Request[];

  @OneToMany(() => Schedule, (schedule) => schedule.brigadier, { cascade: true, onDelete: 'CASCADE' })
  schedules: Schedule[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
