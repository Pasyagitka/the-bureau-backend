import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('address_pkey', ['id'], { unique: true })
@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'city' })
  city: string;

  @Column('text', { name: 'street' })
  street: string;

  @Column('text', { name: 'house', nullable: true })
  house: string;

  @Column('integer', { name: 'flat', nullable: true })
  flat: number | null;

  @Column('text', { name: 'lat', nullable: true })
  lat: string;

  @Column('text', { name: 'lon', nullable: true })
  lon: string;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
