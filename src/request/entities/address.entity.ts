import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';

@Index('address_pkey', ['id'], { unique: true })
@Entity('address', { schema: 'public' })
export class Address {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'country' })
  country: string;

  @Column('text', { name: 'city' })
  city: string;

  @Column('integer', { name: 'house' })
  house: number;

  @Column('text', { name: 'corpus', nullable: true })
  corpus: string | null;

  @Column('integer', { name: 'flat', nullable: true })
  flat: number | null;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToMany(() => Request, (request) => request.address)
  requests: Request[];
}
