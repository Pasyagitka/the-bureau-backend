import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage } from './entities/stage.entity';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
  ) {}

  async getAll(): Promise<Stage[]> {
    return this.stageRepository.find();
  }
}
