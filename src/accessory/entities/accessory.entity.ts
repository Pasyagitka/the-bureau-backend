import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { RequestAccessory } from '../../request/entities/request-accessory.entity';

@Index('accessory_pkey', ['id'], { unique: true })
@Entity('accessory', { schema: 'public' })
export class Accessory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'sku', nullable: true })
  sku: number | null;

  @Column('text', { name: 'name' })
  name: string;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @ManyToOne(() => Equipment, (equipment) => equipment.accessories) //todo one or many?
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @OneToMany(
    () => RequestAccessory,
    (requestAccessory) => requestAccessory.accessory,
  )
  requestAccessories: RequestAccessory[];
}
