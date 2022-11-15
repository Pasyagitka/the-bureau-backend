import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('report_pkey', ['id'], { unique: true })
@Entity('report')
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'file' })
  file: string;

  @ManyToOne(() => Request, (request) => request.reports)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;

  @DeleteDateColumn()
  deletedAt?: Date;
}
