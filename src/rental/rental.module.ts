import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Tool } from 'src/tool/entities/tool.entity';
import { Rental } from './entities/rental.entity';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rental, Tool, Brigadier])],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
