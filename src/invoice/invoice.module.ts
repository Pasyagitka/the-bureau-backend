import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accessory } from '../accessory/entities/accessory.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-items.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { AbilityModule } from '../ability/ability.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory, Invoice, InvoiceItem, Brigadier]), AbilityModule, CloudinaryModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
