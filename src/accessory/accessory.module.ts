import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessoryService } from './accessory.service';
import { AccessoryController } from './accessory.controller';
import { Accessory } from './entities/accessory.entity';
import { RequestAccessory } from 'src/request/entities/request-accessory.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory, Equipment, RequestAccessory])],
  controllers: [AccessoryController],
  providers: [AccessoryService],
})
export class AccessoryModule {}
