import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';

@Index('Mounting_pkey', ['id'], { unique: true })
@Entity('mounting', { schema: 'public' })
export class Mounting {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'mounting' })
  mounting: string;

  @OneToMany(() => Equipment, (equipment) => equipment.mounting)
  equipment: Equipment[];
}
