import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';

@Index('report_pkey', ['id'], { unique: true })
@Entity('report', { schema: 'public' })
export class Report {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'file' })
  file: string;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @ManyToOne(() => Request, (request) => request.reports)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;
}
