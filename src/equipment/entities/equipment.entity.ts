import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Accessory } from '../../accessory/entities/accessory.entity';
import { RequestEquipment } from '../../request/entities/request-equipment.entity';
import { Mounting } from '../types/mounting.enum';

@Index('Equipment_pkey', ['id'], { unique: true })
@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'type' })
  type: string;

  @OneToMany(() => Accessory, (accessory) => accessory.equipment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  accessories: Accessory[];

  @Column({
    type: 'enum',
    enum: Mounting,
    default: Mounting.FLOOR,
  })
  mounting: Mounting;

  @OneToMany(() => RequestEquipment, (requestEquipment) => requestEquipment.equipment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestEquipment: RequestEquipment[];

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
