import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brigadier } from './brigadier.entity';
import { Tool } from '../../tool/entities/tool.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('brigadier_tool_pkey', ['id'], { unique: true })
@Entity('brigadier_tool', { schema: 'public' })
export class BrigadierTool extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.brigadierTools)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Tool, (tool) => tool.brigadierTools)
  @JoinColumn([{ name: 'toolId', referencedColumnName: 'id' }])
  tool: Tool;
}
