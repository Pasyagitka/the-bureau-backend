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
import { Request } from '../../request/entities/request.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Index('client_pkey', ['id'], { unique: true })
@Entity('client', { schema: 'public' })
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'firstname' })
  firstname: string;

  @Column('text', { name: 'surname' })
  surname: string;

  @Column('text', { name: 'patronymic' })
  patronymic: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'contactNumber' })
  contactNumber: string;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted: boolean;

  @OneToOne(() => User)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Request, (request) => request.client)
  requests: Request[];
}
