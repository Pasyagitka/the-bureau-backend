import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Accessory } from '../../accessory/entities/accessory.entity';
import { Mounting } from './mounting.entity';
import { RequestEquipment } from '../../request/entities/request-equipment.entity';

@Index('Equipment_pkey', ['id'], { unique: true })
@Entity('equipment', { schema: 'public' })
export class Equipment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'type' })
  type: string;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToMany(() => Accessory, (accessory) => accessory.equipment)
  accessories: Accessory[];

  @ManyToOne(() => Mounting, (mounting) => mounting.equipment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mountingId', referencedColumnName: 'id' }])
  mounting: Mounting;

  @OneToMany(
    () => RequestEquipment,
    (requestEquipment) => requestEquipment.equipment,
  )
  requestEquipment: RequestEquipment[];
}
