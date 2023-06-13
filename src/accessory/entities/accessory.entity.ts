import { Exclude } from 'class-transformer';
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
import { InvoiceItem } from '../../invoice/entities/invoice-items.entity';

@Index('accessory_pkey', ['id'], { unique: true })
@Entity('accessory')
export class Accessory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'sku', nullable: false, unique: true })
  sku: string;

  @Column('text', { name: 'name' })
  name: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.accessories)
  @JoinColumn([{ name: 'equipmentId', referencedColumnName: 'id' }])
  equipment: Equipment;

  @Column({ nullable: true })
  equipmentId: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    name: 'price',
    default: 0,
  })
  price: number;

  @Column('integer', { name: 'quantity_in_stock', default: () => '0' })
  quantity_in_stock: number;

  @Column('integer', { name: 'quantity_reserved', default: () => '0' })
  quantity_reserved: number;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.accessory)
  invoiceItems: InvoiceItem[];

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
