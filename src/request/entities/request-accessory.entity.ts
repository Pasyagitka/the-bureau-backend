import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Accessory } from '../../accessory/entities/accessory.entity';
import { Request } from './request.entity';

@Index('request_accessory_pkey', ['id'], { unique: true })
@Entity('request_accessory')
export class RequestAccessory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '0' })
  quantity: number;

  @ManyToOne(() => Accessory, (accessory) => accessory.requestAccessories)
  @JoinColumn([{ name: 'accessoryId', referencedColumnName: 'id' }])
  accessory: Accessory;

  @ManyToOne(() => Request, (request) => request.requestAccessories)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;
}
