import {
  Column,
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
import { Stage } from './stage.entity';
import { RequestAccessory } from './request-accessory.entity';
import { RequestEquipment } from './request-equipment.entity';
import { RequestTool } from './request-tool.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

export enum RequestStatus { //todo move to file
  INPROCESSING = 'InProcessing',
  COMPLETED = 'Completed',
  APPROVED = 'Approved',
}

@Index('request_pkey', ['id'], { unique: true })
@Entity('request')
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'registerDate' })
  registerDate: Date;

  @Column('date', { name: 'clientDateStart', nullable: true })
  clientDateStart: Date;

  @Column('date', { name: 'mountingDate', nullable: true })
  mountingDate: string | null;

  @Column('date', { name: 'clientDateEnd', nullable: true })
  clientDateEnd: Date;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @OneToMany(() => Report, (report) => report.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reports: Report[];

  @OneToOne(() => Address, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'addressId', referencedColumnName: 'id' }])
  address: Address;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.requests)
  @JoinColumn([{ name: 'brigadierId', referencedColumnName: 'id' }])
  brigadier: Brigadier;

  @ManyToOne(() => Client, (client) => client.requests)
  @JoinColumn([{ name: 'clientId', referencedColumnName: 'id' }])
  client: Client;

  @ManyToOne(() => Stage, (stage) => stage.requests)
  @JoinColumn([{ name: 'stageId', referencedColumnName: 'id' }])
  stage: Stage;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.INPROCESSING,
  })
  status: RequestStatus;

  @OneToMany(
    () => RequestAccessory,
    (requestAccessory) => requestAccessory.request,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  requestAccessories: RequestAccessory[];

  @OneToMany(
    () => RequestEquipment,
    (requestEquipment) => requestEquipment.request,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
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

  @DeleteDateColumn()
  deletedAt?: Date;
}
