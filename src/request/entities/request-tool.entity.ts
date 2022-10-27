import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';
import { Tool } from '../../tool/entities/tool.entity';

@Index('request_tool_pkey', ['id'], { unique: true })
@Entity('request_tool', { schema: 'public' })
export class RequestTool {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', default: () => '1' })
  quantity: number;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @ManyToOne(() => Request, (request) => request.requestTools)
  @JoinColumn([{ name: 'requestId', referencedColumnName: 'id' }])
  request: Request;

  @ManyToOne(() => Tool, (tool) => tool.requestTools)
  @JoinColumn([{ name: 'toolId', referencedColumnName: 'id' }])
  tool: Tool;
}
