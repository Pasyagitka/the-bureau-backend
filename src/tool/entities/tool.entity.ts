import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BrigadierTool } from '../../brigadier/entities/brigadier-tool.entity';
import { RequestTool } from '../../request/entities/request-tool.entity';
import { Stage } from '../../request/entities/stage.entity';

@Index('tool_pkey', ['id'], { unique: true })
@Entity('tool', { schema: 'public' })
export class Tool {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('integer', { name: 'quantity', default: () => '0' })
  quantity: number;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToMany(() => BrigadierTool, (brigadierTool) => brigadierTool.tool)
  brigadierTools: BrigadierTool[];

  @OneToMany(() => RequestTool, (requestTool) => requestTool.tool)
  requestTools: RequestTool[];

  @ManyToOne(() => Stage, (stage) => stage.tools)
  @JoinColumn([{ name: 'stageId', referencedColumnName: 'id' }])
  stage: Stage;
}
