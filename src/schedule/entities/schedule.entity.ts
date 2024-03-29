import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Request } from '../../request/entities/request.entity';

@Index('schedule_pkey', ['id'], { unique: true })
@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.schedules)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Request, (request) => request.schedules)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;

  @Column({ nullable: true })
  requestId: number;

  @CreateDateColumn({ name: 'modifiedDate', type: 'timestamptz' })
  modifiedDate: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
