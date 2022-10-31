import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Accessory } from '../../accessory/entities/accessory.entity';
import { Request } from './request.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('request_accessory_pkey', ['id'], { unique: true })
@Entity('request_accessory', { schema: 'public' })
export class RequestAccessory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '0' })
  quantity: number;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @ManyToOne(() => Accessory, (accessory) => accessory.requestAccessories)
  @JoinColumn([{ name: 'accessoryId', referencedColumnName: 'id' }])
  accessory: Accessory;

  @ManyToOne(() => Request, (request) => request.requestAccessories)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;
}
