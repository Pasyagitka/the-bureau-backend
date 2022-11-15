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
import { Accessory } from '../../accessory/entities/accessory.entity';
import { Mounting } from './mounting.entity';
import { RequestEquipment } from '../../request/entities/request-equipment.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('Equipment_pkey', ['id'], { unique: true })
@Entity('equipment')
export class Equipment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'type' })
  type: string;

  @OneToMany(() => Accessory, (accessory) => accessory.equipment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  accessories: Accessory[];

  @ManyToOne(() => Mounting, (mounting) => mounting.equipment, {
    eager: true,
  })
  @JoinColumn([{ name: 'mountingId', referencedColumnName: 'id' }])
  mounting: Mounting;

  @OneToMany(
    () => RequestEquipment,
    (requestEquipment) => requestEquipment.equipment,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  requestEquipment: RequestEquipment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
