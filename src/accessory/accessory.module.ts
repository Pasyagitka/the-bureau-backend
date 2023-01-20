import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { AccessoryController } from './accessory.controller';
import { AccessoryService } from './accessory.service';
import { Accessory } from './entities/accessory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory, Equipment])],
  controllers: [AccessoryController],
  providers: [AccessoryService],
})
export class AccessoryModule {}
