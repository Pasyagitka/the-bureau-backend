import { Exclude } from 'class-transformer';
import {
  Entity,
  Index,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @CreateDateColumn({ name: 'modifiedDate' })
  modifiedDate: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
