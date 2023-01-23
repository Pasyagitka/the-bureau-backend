import { Exclude } from 'class-transformer';
import { RequestReport } from 'src/request-report/entities/request-report.entity';
import { Stage } from 'src/stage/entities/stage.entity';
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
  PrimaryGeneratedColumn
} from 'typeorm';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Client } from '../../client/entities/client.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { RequestStatus } from '../types/request-status.enum';
import { Address } from './address.entity';
import { RequestEquipment } from './request-equipment.entity';

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

  @OneToMany(() => RequestReport, (report) => report.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reports: RequestReport[];

  @OneToOne(() => Address, { cascade: true, onDelete: 'CASCADE' })
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

  @OneToMany(() => RequestEquipment, (requestEquipment) => requestEquipment.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  requestEquipment: RequestEquipment[];

  @OneToMany(() => Schedule, (schedule) => schedule.request, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  schedules: Schedule[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
