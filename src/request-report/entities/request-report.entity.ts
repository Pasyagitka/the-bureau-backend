import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from '../../request/entities/request.entity';

@Index('request_report_pkey', ['id'], { unique: true })
@Entity('request_report')
export class RequestReport {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'file' })
  file: string;

  @ManyToOne(() => Request, (request) => request.reports)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
