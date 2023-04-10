import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { Request } from './request.entity';

@Index('request_equipment_pkey', ['id'], { unique: true })
@Entity('request_equipment')
export class RequestEquipment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @ManyToOne(() => Equipment, (equipment) => equipment.requestEquipment)
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @ManyToOne(() => Request, (request) => request.requestEquipment)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
