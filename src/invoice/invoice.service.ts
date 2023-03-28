import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory } from '../accessory/entities/accessory.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Repository, In } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceItem } from './entities/invoice-items.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const accessories = await this.accessoryRepository.find({
      where: { id: In(createInvoiceDto.items.map((i) => i.accessoryId)) },
    });
    if (accessories.length !== createInvoiceDto.items.length) {
      throw new BadRequestException('Неверно перечислен список комплектующих');
    }
    const invoiceItems = createInvoiceDto.items.map((i) => {
      const accessory = accessories.find((x) => x.id === i.accessoryId);
      return this.invoiceItemRepository.create({
        accessory,
        quantity: i.quantity,
        price: accessory.price,
        sum: i.quantity * accessory.price,
      });
    });
    const brigadier = await this.brigadierRepository.findOne({ where: { id: createInvoiceDto.customerId } });
    const invoice = new Invoice();
    invoice.customer = brigadier;
    invoice.items = invoiceItems;
    invoice.total = invoiceItems.reduce((acc, curr) => acc + (Number(curr.sum) || 0), 0);
    await this.invoiceRepository.save(invoice);
    return { message: 'OK' }; //TODO constructor
  }
}
