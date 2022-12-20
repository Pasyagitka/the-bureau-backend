import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { RequestEquipment } from 'src/request/entities/request-equipment.entity';
import { Equipment } from './entities/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, Accessory, RequestEquipment])],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
