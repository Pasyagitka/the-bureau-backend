import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from '../../request/entities/request.entity';
import { Tool } from '../../tool/entities/tool.entity';

@Index('stage_pkey', ['id'], { unique: true })
@Entity('stage')
export class Stage {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'stage' })
  stage: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    name: 'mountingPrice',
    default: 0,
  })
  mountingPrice: number;

  @OneToMany(() => Request, (request) => request.stage, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  requests: Request[];

  @OneToMany(() => Tool, (tool) => tool.stage, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  tools: Tool[];
}
