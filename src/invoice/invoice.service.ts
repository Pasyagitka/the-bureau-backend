import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory } from '../accessory/entities/accessory.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Repository, In } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceItem } from './entities/invoice-items.entity';
import { Invoice } from './entities/invoice.entity';
import * as carbone from 'carbone';
import { PaginatedQuery } from '../common/pagination/paginated-query.dto';
import { User } from 'src/user/entities/user.entity';
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

  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
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
    const brigadier = await this.brigadierRepository.findOne({
      where: { id: createInvoiceDto.customerId || user?.brigadier?.id },
    });
    const invoice = new Invoice();
    invoice.customer = brigadier;
    invoice.items = invoiceItems;
    invoice.total = invoiceItems.reduce((acc, curr) => acc + (Number(curr.sum) || 0), 0);
    await this.invoiceRepository.save(invoice);
    return { message: 'OK' }; //TODO constructor
  }

  async findAll(query: PaginatedQuery) {
    //TODO add filter options
    return this.invoiceRepository.findAndCount({
      relations: { customer: true },
      order: { id: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });
  }

  async getForBrigadier(customerId: number, query: PaginatedQuery) {
    const invoices = await this.invoiceRepository.findAndCount({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: { customer: true },
      order: { id: 'ASC' },
      skip: query.offset,
      take: query.limit,
    });
    return invoices;
  }

  async getInvoice(id: number): Promise<Buffer> {
    const templatePath = './assets/accessory-invoice-template.docx';
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: {
        items: {
          accessory: true,
        },
        customer: true,
      },
    });
    const data = {
      invoice: {
        id: invoice.id,
        total: invoice.total,
      },
      customer: {
        contactNumber: invoice.customer.contactNumber,
        name: `${invoice.customer.firstname} ${invoice.customer.patronymic} ${invoice.customer.surname}`,
      },
      items: invoice.items,
    };
    return new Promise((resolve, reject) => {
      carbone.render(templatePath, data, function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}
