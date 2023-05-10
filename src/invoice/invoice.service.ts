import { Injectable, UploadedFile } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory } from '../accessory/entities/accessory.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Repository, In, DataSource, LessThan, MoreThan } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceItem } from './entities/invoice-items.entity';
import { Invoice } from './entities/invoice.entity';
import * as carbone from 'carbone';
import { PaginatedQuery } from '../common/pagination/paginated-query.dto';
import { User } from '../user/entities/user.entity';
import { NotExistsError } from '../common/exceptions';
import { ForbiddenError } from '@casl/ability';
import { AbilityFactory } from '../ability/ability.factory';
import { Action } from '../ability/types';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InvoiceStatus } from './types/invoice-status.enum';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';

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
    private cloudinary: CloudinaryService,
    private dataSource: DataSource,
    private readonly abilityFactory: AbilityFactory,
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
    return { message: 'OK' };
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

  async getItems(id: number): Promise<InvoiceItem[]> {
    return this.invoiceItemRepository.find({
      where: { invoiceId: id },
      relations: { accessory: true },
    });
  }

  async remove(id: number) {
    const item = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!item) throw new NotExistsError('счет');
    return await this.invoiceRepository.softRemove(item);
  }

  async get(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateInvoiceDto: any, user: User): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
    });
    if (!invoice) throw new NotExistsError('счет');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, invoice);

    invoice.status = updateInvoiceDto.status;
    return await this.invoiceRepository.save(invoice);
  }

  async updateItems(id: number, updateInvoiceItemsDto: any, user: User) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: { items: true, customer: true },
    });
    if (!invoice) throw new NotExistsError('счет');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, invoice);

    const accessories = await this.accessoryRepository.find({
      where: { id: In(updateInvoiceItemsDto.items.map((i) => i.accessoryId)) },
    });
    if (accessories.length !== updateInvoiceItemsDto.items.length) {
      throw new BadRequestException('Неверно перечислен список комплектующих');
    }
    const invoiceItems = updateInvoiceItemsDto.items.map((i) => {
      const accessory = accessories.find((x) => x.id === i.accessoryId);
      return this.invoiceItemRepository.create({
        accessory,
        quantity: i.quantity,
        price: accessory.price,
        sum: i.quantity * accessory.price,
      });
    });
    invoice.items = invoiceItems;
    invoice.total = invoiceItems.reduce((acc, curr) => acc + (Number(curr.sum) || 0), 0);
    return await this.invoiceRepository.save(invoice);
  }

  async uploadScan(id: number, file: Express.Multer.File) {
    return await this.dataSource.transaction(async (transaction) => {
      const invoice = await this.invoiceRepository.findOne({ where: { id } });
      if (!invoice) throw new NotExistsError('счет');

      const uploadResult = await this.cloudinary
        .uploadImage(file, {
          folder: `invoiceScans/`,
          overwrite: true,
          resource_type: 'image',
          public_id: id,
        })
        .catch(() => {
          throw new BadRequestException(
            'Произошла ошибка при попытке загрузить изображение. Попробуйте снова позже...',
          );
        });

      const invoiceAccessories = await this.accessoryRepository.find({
        where: { id: In(invoice.items.map((i) => i.accessoryId)) },
      });
      invoiceAccessories.forEach((x, i) => {
        x.quantity_in_stock -= invoice.items[i].quantity;
        x.quantity_reserved += invoice.items[i].quantity;
      });
      await transaction.getRepository(Accessory).save(invoiceAccessories);

      invoice.scanUrl = uploadResult.secure_url;
      invoice.status = InvoiceStatus.CREATED;
      return await transaction.getRepository(Invoice).save(invoice);
    });
  }

  async uploadReceipt(id: number, file: Express.Multer.File, user: User) {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) throw new NotExistsError('счет');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, invoice);

    const uploadResult = await this.cloudinary
      .uploadImage(file, {
        folder: `invoiceReceipts/`,
        overwrite: true,
        resource_type: 'image',
        public_id: id,
      })
      .catch(() => {
        throw new BadRequestException('Произошла ошибка при попытке загрузить изображение. Попробуйте снова позже...');
      });
    invoice.receiptUrl = uploadResult.secure_url;
    invoice.status = InvoiceStatus.PAID;
    await this.invoiceRepository.save(invoice);
  }

  async updateByStatus(id: number, updateInvoiceDto: UpdateInvoiceDto, user: User): Promise<Invoice> {
    return await this.dataSource.transaction(async (transaction) => {
      const invoice = await this.invoiceRepository.findOne({ where: { id }, relations: { items: true } });
      if (!invoice) throw new NotExistsError('счет');

      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, invoice);

      const invoiceAccessories = await this.accessoryRepository.find({
        where: { id: In(invoice.items.map((i) => i.accessoryId)) },
      });
      switch (updateInvoiceDto.status) {
        case InvoiceStatus.CREATED: {
          break;
        }
        case InvoiceStatus.PAID: {
          break;
        }
        case InvoiceStatus.APPROVED: {
          invoiceAccessories.forEach((x, i) => {
            x.quantity_reserved -= invoice.items[i].quantity;
          });
          break;
        }
        case InvoiceStatus.EXPIRED: {
          invoiceAccessories.forEach((x, i) => {
            x.quantity_in_stock += invoice.items[i].quantity;
            x.quantity_reserved -= invoice.items[i].quantity;
          });
          break;
        }
      }
      await transaction.getRepository(Accessory).save(invoiceAccessories);
      invoice.status = updateInvoiceDto.status;
      return await transaction.getRepository(Invoice).save(invoice);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async findExpired() {
    return await this.dataSource.transaction(async (transaction) => {
      const maxDate = dayjs().subtract(5, 'days').startOf('day').toDate();
      const expiredInvoices = await this.invoiceRepository.find({
        where: {
          status: InvoiceStatus.CREATED,
          updatedAt: LessThan(maxDate),
        },
        relations: { items: true },
      });
      await Promise.all(
        expiredInvoices.map(async (invoice) => {
          const invoiceAccessories = await this.accessoryRepository.find({
            where: { id: In(invoice.items.map((i) => i.accessoryId)) },
          });
          invoiceAccessories.forEach((x, i) => {
            x.quantity_in_stock += invoice.items[i].quantity;
            x.quantity_reserved -= invoice.items[i].quantity;
          });
          await transaction.getRepository(Accessory).save(invoiceAccessories);
          invoice.status = InvoiceStatus.EXPIRED;
          await transaction.getRepository(Invoice).save(invoice);
        }),
      );
      return await transaction.getRepository(Invoice).softRemove(expiredInvoices);
    });
  }
}
