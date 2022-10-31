import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from './report.entity';
import { Address } from './address.entity';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Client } from '../../client/entities/client.entity';
import { Stage } from './stage.entity';
import { Status } from './status.entity';
import { RequestAccessory } from './request-accessory.entity';
import { RequestEquipment } from './request-equipment.entity';
import { RequestTool } from './request-tool.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('request_pkey', ['id'], { unique: true })
@Entity('request', { schema: 'public' })
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'registerDate' })
  registerDate: string;

  @Column('date', { name: 'clientDateStart' })
  clientDateStart: string;

  @Column('date', { name: 'mountingDate', nullable: true })
  mountingDate: string | null;

  @Column('date', { name: 'clientDateEnd' })
  clientDateEnd: string;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToMany(() => Report, (report) => report.request)
  reports: Report[];

  @ManyToOne(() => Address, (address) => address.requests)
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

  @ManyToOne(() => Status, (status) => status.requests)
  @JoinColumn([{ name: 'statusId', referencedColumnName: 'id' }])
  status: Status;

  @OneToMany(
    () => RequestAccessory,
    (requestAccessory) => requestAccessory.request,
  )
  requestAccessories: RequestAccessory[];

  @OneToMany(
    () => RequestEquipment,
    (requestEquipment) => requestEquipment.request,
  )
  requestEquipment: RequestEquipment[];

  @OneToMany(() => RequestTool, (requestTool) => requestTool.request)
  requestTools: RequestTool[];

  @OneToMany(() => Schedule, (schedule) => schedule.request)
  schedules: Schedule[];
}
