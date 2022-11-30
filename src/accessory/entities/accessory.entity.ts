import {
  Column,
  DeleteDateColumn,
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
@Entity('accessory')
export class Accessory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'sku', nullable: true, unique: false })
  sku: string | null;

  @Column('text', { name: 'name' })
  name: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.accessories, {
    eager: true,
  }) //TODO one or many?
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @OneToMany(
    () => RequestAccessory,
    (requestAccessory) => requestAccessory.accessory,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  requestAccessories: RequestAccessory[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
