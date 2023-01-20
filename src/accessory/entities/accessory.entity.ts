import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Index('accessory_pkey', ['id'], { unique: true })
@Entity('accessory')
export class Accessory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'sku', nullable: true, unique: false })
  sku: string | null;

  @Column('text', { name: 'name' })
  name: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.accessories)
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
