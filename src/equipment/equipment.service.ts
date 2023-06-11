import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyExistsError, NotExistsError } from '../common/exceptions';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      order: { id: 'ASC' },
    });
  }

  async get(id: number): Promise<Equipment> {
    return await this.equipmentRepository.findOne({ where: { id } });
  }

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { type: createEquipmentDto.type },
    });
    if (equipment) throw new AlreadyExistsError('equipment');
    const item = this.equipmentRepository.create(createEquipmentDto);
    await this.equipmentRepository.save(item);
    return item;
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    if (!equipment) throw new NotExistsError('equipment');
    return this.equipmentRepository.save({ id, ...updateEquipmentDto });
  }

  async remove(id: number) {
    const item = await this.equipmentRepository.findOne({
      where: { id },
    });
    if (!item) throw new NotExistsError('equipment');
    return await this.equipmentRepository.softRemove(item);
  }
}
