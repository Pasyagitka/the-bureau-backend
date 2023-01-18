import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from './report.entity';
import { Address } from './address.entity';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Client } from '../../client/entities/client.entity';
import { RequestAccessory } from './request-accessory.entity';
import { RequestEquipment } from './request-equipment.entity';
import { RequestTool } from './request-tool.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { RequestStatus } from '../types/request-status.enum';
import { Stage } from 'src/stage/entities/stage.entity';
import { Exclude } from 'class-transformer';

@Index('request_pkey', ['id'], { unique: true })
@Entity('request')
export class Request {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'registerDate' })
  registerDate: Date;

  @Column('date', { name: 'mountingDate', nullable: true })
  mountingDate: Date;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @OneToMany(() => Report, (report) => report.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reports: Report[];

  @OneToOne(() => Address, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'addressId', referencedColumnName: 'id' }])
  address: Address;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.requests, { eager: true })
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Client, (client) => client.requests)
  @JoinColumn([{ name: 'clientId', referencedColumnName: 'id' }])
  client: Client;

  @ManyToOne(() => Stage, (stage) => stage.requests, { eager: true })
  @JoinColumn([{ name: 'stageId', referencedColumnName: 'id' }])
  stage: Stage;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.INPROCESSING,
  })
  status: RequestStatus;

  @OneToMany(() => RequestAccessory, (requestAccessory) => requestAccessory.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestAccessories: RequestAccessory[];

  @OneToMany(() => RequestEquipment, (requestEquipment) => requestEquipment.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestEquipment: RequestEquipment[];

  @OneToMany(() => RequestTool, (requestTool) => requestTool.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestTools: RequestTool[];

  @OneToMany(() => Schedule, (schedule) => schedule.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  schedules: Schedule[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
