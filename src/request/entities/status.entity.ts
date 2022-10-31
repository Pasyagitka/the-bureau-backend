import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('status_pkey', ['id'], { unique: true })
@Entity('status', { schema: 'public' })
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'status' })
  status: string;

  @OneToMany(() => Request, (request) => request.status)
  requests: Request[];
}
