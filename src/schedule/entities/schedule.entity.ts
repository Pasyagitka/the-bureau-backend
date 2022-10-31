import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Request } from '../../request/entities/request.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('schedule_pkey', ['id'], { unique: true })
@Entity('schedule', { schema: 'public' })
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.schedules)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Request, (request) => request.schedules)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;
}
