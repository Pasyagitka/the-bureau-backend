import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, DataSource, DeepPartial, ILike, MoreThan, ObjectLiteral, Repository } from 'typeorm';
import { NotExistsError } from '../common/exceptions';
import { Equipment } from '../equipment/entities/equipment.entity';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';
import { FindAllQueryDto } from './dto/findAll-query.dto';
import { CsvParser } from 'nest-csv-parser';
import { ParsedData } from 'nest-csv-parser/dist';
import { User } from '../user/entities/user.entity';
import { Readable } from 'stream';
import * as carbone from 'carbone';
import * as json2csv from 'json2csv';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    private readonly csvParser: CsvParser,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: FindAllQueryDto) {
    return this.accessoryRepository.findAndCount({
      relations: {
        equipment: true,
      },
      order: { id: 'ASC' },
      skip: query.offset,
      take: query.limit,
      where: {
        equipment: {
          id: query.equipmentId && Any(query.equipmentId),
        },
        name: query.search && ILike(`%${query.search || ''}%`),
      },
    });
  }

  async get(id: number): Promise<Accessory> {
    const item = await this.accessoryRepository.findOne({
      where: { id },
      relations: {
        equipment: true,
      },
    });
    if (!item) {
      throw new NotExistsError('accessory');
    }
    return item;
  }

  async getAvaliableForInvoice(): Promise<Accessory[]> {
    return this.accessoryRepository.find({
      where: {
        quantity_in_stock: MoreThan(0),
      },
      order: { id: 'ASC' },
    });
  }

  async create(createAccessoryDto: CreateAccessoryDto): Promise<Accessory> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id: createAccessoryDto.equipmentId },
    });
    if (!equipment) throw new NotExistsError('equipment');

    const item = this.accessoryRepository.create(createAccessoryDto);
    item.equipment = equipment;
    return await this.accessoryRepository.save(item);
  }

  async import(file: Express.Multer.File): Promise<[ObjectLiteral[], number]> {
    const { list: entities }: ParsedData<Accessory> = await this.csvParser.parse(
      Readable.from(file.buffer),
      Accessory,
      null,
      null,
      { separator: ',' },
    );
    //const equipmentIds = importAccessoriesDto.map((i) => i.equipmentId);
    //const idsCount = await this.equipmentRepository.count({ where: { id: In(equipmentIds) } });
    //if (idsCount !== equipmentIds.length) throw new BadParametersError('equipment');
    // const items = await Promise.all(
    //   importAccessoriesDto.map(async (createAccessoryDto) => {
    //     return this.accessoryRepository.create({
    //       sku: createAccessoryDto.sku,
    //       name: createAccessoryDto.name,
    //       price: createAccessoryDto.price,
    //       equipmentId: createAccessoryDto.equipmentId,
    //       quantity_in_stock: createAccessoryDto.quantity,
    //     });
    //   }),
    // );
    const res = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Accessory)
      .values(entities)
      .orUpdate(['sku', 'name', 'equipmentId', 'price', 'quantity_in_stock', 'quantity_reserved'], ['id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .returning('*')
      .execute();
    return [res.generatedMaps, res.generatedMaps.length];
  }

  async export(): Promise<Buffer> {
    const accessories = await this.accessoryRepository.find();
    const fields = ['id', 'sku', 'name', 'equipmentId', 'price', 'quantity_in_stock', 'quantity_reserved'];
    const json2csvParser = new json2csv.Parser({ fields });
    const data = json2csvParser.parse(accessories);
    return data;
  }

  async update(id: number, updateAccessoryDto: UpdateAccessoryDto): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findOne({ where: { id } });
    if (!accessory) throw new NotExistsError('accessory');

    if (!updateAccessoryDto.sku) {
      if (updateAccessoryDto.sku === null) accessory.sku = null;
    } else {
      accessory.sku = updateAccessoryDto.sku;
    }
    const equipment = await this.equipmentRepository.findOne({
      where: { id: updateAccessoryDto.equipmentId },
    });
    if (!equipment) throw new NotExistsError('equipment');
    accessory.equipment = equipment;
    accessory.name = updateAccessoryDto.name;
    accessory.price = updateAccessoryDto.price;
    accessory.quantity_in_stock = updateAccessoryDto.quantity;
    return this.accessoryRepository.save(accessory);
  }

  async remove(id: number): Promise<Accessory> {
    const item = await this.accessoryRepository.findOne({
      where: { id },
    });
    if (!item) throw new NotExistsError('accessory');
    return await this.accessoryRepository.softRemove(item);
  }
}
