import { Exclude } from 'class-transformer';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Tool } from '../../tool/entities/tool.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RentalStatus } from '../types/rental-status.enum';

@Index('rental_pkey', ['id'], { unique: true })
@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'startDate' })
  startDate: Date;

  @Column({ name: 'endDate', type: 'timestamp' })
  endDate: Date;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.brigadierRentals)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Tool, (tool) => tool.id)
  @JoinColumn([{ name: 'toolId', referencedColumnName: 'id' }])
  tool: Tool;

  @Column('integer', { name: 'quantity' })
  quantity: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'price', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: RentalStatus,
    default: RentalStatus.INPROCESSING,
  })
  status: RentalStatus;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
