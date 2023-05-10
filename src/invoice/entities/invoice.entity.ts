import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import {
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Entity,
  Index,
  OneToMany,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { InvoiceItem } from './invoice-items.entity';
import { InvoiceStatus } from '../types/invoice-status.enum';
import { Exclude } from 'class-transformer';

@Index('invoice_pkey', ['id'], { unique: true })
@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.invoices)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Brigadier;

  @OneToMany(() => InvoiceItem, (invoiceItems) => invoiceItems.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  items: InvoiceItem[];

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'totalPrice', default: 0 })
  total: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.IN_PROCESSING,
  })
  status: InvoiceStatus;

  @Column('text', { name: 'url', nullable: true })
  receiptUrl: string;

  @Column('text', { name: 'scanUrl', nullable: true })
  scanUrl: string;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
