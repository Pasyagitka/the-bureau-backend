import { Exclude } from 'class-transformer';
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
import { BrigadierTool } from '../../brigadier/entities/brigadier-tool.entity';
import { RequestTool } from '../../request/entities/request-tool.entity';
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

  @Column('integer', { name: 'rental_price', default: () => '0' })
  rental_price: number;

  @OneToMany(() => BrigadierTool, (brigadierTool) => brigadierTool.tool, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  brigadierTools: BrigadierTool[];

  @OneToMany(() => RequestTool, (requestTool) => requestTool.tool, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestTools: RequestTool[];

  @ManyToOne(() => Stage, (stage) => stage.tools)
  @JoinColumn([{ name: 'stageId', referencedColumnName: 'id' }])
  stage: Stage;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
