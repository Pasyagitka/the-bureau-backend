import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BrigadierTool } from './brigadier-tool.entity';
import { Request } from '../../request/entities/request.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Index('brigadier_pkey', ['id'], { unique: true })
@Entity('brigadier', { schema: 'public' })
export class Brigadier {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'firstname' })
  firstname: string;

  @Column('text', { name: 'surname' })
  surname: string;

  @Column('text', { name: 'patronymic' })
  patronymic: string;

  @Column('text', { name: 'contactNumber' })
  contactNumber: string;

  @Column('float', { name: 'rating', default: () => '0' })
  rating: number;

  @Column('boolean', { name: 'isApproved', default: () => 'false' })
  isApproved: boolean;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToOne(() => User)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => BrigadierTool, (brigadierTool) => brigadierTool.brigadier)
  brigadierTools: BrigadierTool[];

  @OneToMany(() => Request, (request) => request.brigadier)
  requests: Request[];

  @OneToMany(() => Schedule, (schedule) => schedule.brigadier)
  schedules: Schedule[];
}
