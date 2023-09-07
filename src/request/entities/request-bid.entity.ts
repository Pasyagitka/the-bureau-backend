import { Exclude } from 'class-transformer';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Index, Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Index('request_bid_pkey', ['id'], { unique: true })
@Entity('request_bid')
export class RequestBid {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column()
  brigadierId: number;

  @Column()
  requestId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @ManyToOne(() => Brigadier, (brigadier) => brigadier.requestBids)
  brigadier: Brigadier;
}
