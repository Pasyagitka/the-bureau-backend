import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { Equipment } from '../equipment/entities/equipment.entity';
import { AccessoryController } from './accessory.controller';
import { AccessoryService } from './accessory.service';
import { Accessory } from './entities/accessory.entity';

@Module({
  imports: [CsvModule, TypeOrmModule.forFeature([Accessory, Equipment])],
  controllers: [AccessoryController],
  providers: [AccessoryService],
})
export class AccessoryModule {}
