import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, ILike, In, MoreThan, Repository } from 'typeorm';
import { BadParametersError, NotExistsError } from '../common/exceptions';
import { Equipment } from '../equipment/entities/equipment.entity';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';
import { FindAllQueryDto } from './dto/findAll-query.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
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
  //TODO return db errors

  async import(importAccessoriesDto: CreateAccessoryDto[]): Promise<Accessory[]> {
    const equipmentIds = importAccessoriesDto.map((i) => i.equipmentId);
    const idsCount = await this.equipmentRepository.count({ where: { id: In(equipmentIds) } });
    if (idsCount !== equipmentIds.length) throw new BadParametersError('equipment');
    const items = await Promise.all(
      importAccessoriesDto.map(async (createAccessoryDto) => {
        return this.accessoryRepository.create({
          sku: createAccessoryDto.sku,
          name: createAccessoryDto.name,
          price: createAccessoryDto.price,
          equipmentId: createAccessoryDto.equipmentId,
          quantity_in_stock: createAccessoryDto.quantity,
        });
      }),
    );
    return await this.accessoryRepository.save(items);
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
