import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { RequestReport } from '../../request-report/entities/request-report.entity';
import { Request } from '../../request/entities/request.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../user/entities/user.entity';

@Index('brigadier_pkey', ['id'], { unique: true })
@Entity('brigadier')
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

  @Column('text', { name: 'avatarUrl', nullable: true })
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.brigadier, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Request, (request) => request.brigadier, { cascade: true, onDelete: 'SET NULL' })
  requests: Request[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => RequestReport, (requestReport) => requestReport.brigadier)
  reports: RequestReport[];

  @OneToMany(() => Schedule, (schedule) => schedule.brigadier, { cascade: true, onDelete: 'CASCADE' })
  schedules: Schedule[];

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
