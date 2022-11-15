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
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('schedule_pkey', ['id'], { unique: true })
@Entity('schedule')
export class Schedule extends BaseEntity {
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

  @DeleteDateColumn()
  deletedAt?: Date;
}
