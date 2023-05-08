import { Accessory } from '../../accessory/entities/accessory.entity';
import { Index, Entity, ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Exclude } from 'class-transformer';

@Index('invoice_item_pkey', ['id'], { unique: true })
@Entity('invoice_item')
export class InvoiceItem {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { orphanedRowAction: 'soft-delete' })
  @JoinColumn([{ name: 'invoiceId', referencedColumnName: 'id' }])
  invoice: Invoice;

  @Column()
  invoiceId: number;

  @ManyToOne(() => Accessory, (accessory) => accessory.invoiceItems)
  @JoinColumn([{ name: 'accessoryId', referencedColumnName: 'id' }])
  accessory: Accessory;

  @Column('integer', { name: 'quantity', default: () => '0' })
  quantity: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'price', default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'sum', default: 0 })
  sum: number;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
