import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from '../common/exceptions';
import { Repository } from 'typeorm';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from './entities/stage.entity';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
  ) {}

  async findAll(): Promise<Stage[]> {
    return this.stageRepository.find({ order: { id: 'asc' } });
  }

  async update(id: number, updateStageDto: UpdateStageDto): Promise<Stage> {
    const stage = await this.stageRepository.findOne({ where: { id } });
    if (!stage) throw new NotExistsError('stage');
    return this.stageRepository.save({ id, ...updateStageDto });
  }
}
