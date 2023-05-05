import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { PrimaryGeneratedColumn, ManyToOne, JoinColumn, Entity, Index, OneToMany, Column } from 'typeorm';
import { InvoiceItem } from './invoice-items.entity';
import { InvoiceStatus } from '../types/invoice-status.enum';

@Index('invoice_pkey', ['id'], { unique: true })
@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.invoices)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Brigadier;

  @OneToMany(() => InvoiceItem, (invoiceItems) => invoiceItems.invoice, { cascade: true })
  items: InvoiceItem[];

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'totalPrice', default: 0 })
  total: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.CREATED,
  })
  status: InvoiceStatus;
}
