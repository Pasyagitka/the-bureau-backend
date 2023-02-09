import { Exclude } from 'class-transformer';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Tool } from 'src/tool/entities/tool.entity';
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

  @Column('boolean', { name: 'isApproved', default: false })
  isApproved: boolean;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
