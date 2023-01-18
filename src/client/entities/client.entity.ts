import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Request } from '../../request/entities/request.entity';
import { Exclude } from 'class-transformer';

@Index('client_pkey', ['id'], { unique: true })
@Entity('client')
export class Client {
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

  @OneToOne(() => User, (user) => user.client, {
    cascade: true,
    //eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Request, (request) => request.client)
  requests: Request[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
