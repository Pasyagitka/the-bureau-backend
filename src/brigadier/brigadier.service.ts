import { Injectable } from '@nestjs/common';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';

@Injectable()
export class BrigadierService {
  create(createBrigadierDto: CreateBrigadierDto) {
    return 'This action adds a new brigadier';
  }

  findAll() {
    return `This action returns all brigadier`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brigadier`;
  }

  update(id: number, updateBrigadierDto: UpdateBrigadierDto) {
    return `This action updates a #${id} brigadier`;
  }

  remove(id: number) {
    return `This action removes a #${id} brigadier`;
  }
}
