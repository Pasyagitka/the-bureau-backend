import { Exclude } from 'class-transformer';
import { Rental } from '../../rental/entities/rental.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Stage } from '../../stage/entities/stage.entity';

@Index('tool_pkey', ['id'], { unique: true })
@Entity('tool')
export class Tool {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('integer', { name: 'quantity_total', default: () => '0' })
  quantity_total: number;

  @Column('integer', { name: 'quantity_in_stock', default: () => '0' })
  quantity_in_stock: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'rental_price', default: 0 })
  rental_price: number;

  @ManyToOne(() => Stage, (stage) => stage.tools)
  @JoinColumn([{ name: 'stageId', referencedColumnName: 'id' }])
  stage: Stage;

  @OneToMany(() => Rental, (toolRentals) => toolRentals.tool, { cascade: true, onDelete: 'CASCADE' })
  toolRentals: Rental[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
