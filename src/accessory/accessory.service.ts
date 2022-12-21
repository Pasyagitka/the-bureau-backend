import { Injectable } from '@nestjs/common';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoryService {
  create(createAccessoryDto: CreateAccessoryDto) {
    return 'This action adds a new accessory';
  }

  findAll() {
    return `This action returns all accessory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accessory`;
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
    console.log(accessory);
    return this.accessoryRepository.save(accessory);
  }

  remove(id: number) {
    return `This action removes a #${id} accessory`;
  }
}
