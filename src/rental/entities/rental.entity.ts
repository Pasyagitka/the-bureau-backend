import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Tool } from '../../tool/entities/tool.entity';

@Index('rental_pkey', ['id'], { unique: true })
@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'startDate' })
  startDate: Date;

  @Column('date', { name: 'endDate' })
  endDate: Date;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.brigadierTools)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Tool, (tool) => tool.brigadierTools)
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
