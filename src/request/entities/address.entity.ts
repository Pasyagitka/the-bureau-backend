import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('address_pkey', ['id'], { unique: true })
@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'country', default: 'Беларусь' })
  country: string;

  @Column('text', { name: 'city' })
  city: string;

  @Column('text', { name: 'street' })
  street: string;

  @Column('integer', { name: 'house' })
  house: number;

  @Column('text', { name: 'corpus', nullable: true })
  corpus: string | null;

  @Column('integer', { name: 'flat', nullable: true })
  flat: number | null;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
