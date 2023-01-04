import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from 'src/common/exceptions';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Repository } from 'typeorm';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async getAll(): Promise<Accessory[]> {
    return this.accessoryRepository.find({ order: { id: 'ASC' } });
  }

  async get(id: number): Promise<Accessory> {
    const item = await this.accessoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotExistsError('accessory');
    }
    return item;
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

  async update(id: number, updateAccessoryDto: UpdateAccessoryDto): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findOne({ where: { id } });
    if (!accessory) throw new NotExistsError('accessory');

    if (updateAccessoryDto.sku === null) {
      accessory.sku = null;
    }
    const equipment = await this.equipmentRepository.findOne({
      where: { id: updateAccessoryDto.equipmentId },
    });
    if (!equipment) throw new NotExistsError('equipment');
    accessory.equipment = equipment;
    accessory.name = updateAccessoryDto.name || accessory.name;
    return this.accessoryRepository.save(accessory);
  }

  async remove(id: number): Promise<Accessory> {
    const item = await this.accessoryRepository.findOne({
      where: { id },
      relations: ['requestAccessories'],
    });
    if (!item) throw new NotExistsError('accessory');
    return await this.accessoryRepository.softRemove(item);
  }
}
