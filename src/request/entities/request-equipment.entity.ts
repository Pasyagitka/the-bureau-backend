import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { Request } from './request.entity';

@Index('request_equipment_pkey', ['id'], { unique: true })
@Entity('request_equipment', { schema: 'public' })
export class RequestEquipment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToOne(() => Equipment, (equipment) => equipment.requestEquipment)
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @OneToOne(() => Request, (request) => request.requestEquipment)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;
}
