import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from '../common/exceptions';
import { Repository } from 'typeorm';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from './entities/stage.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisterUserEvent } from '../auth/events/register-user.event';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Stage[]> {
    return this.stageRepository.find({ order: { id: 'asc' } });
  }

  async update(id: number, updateStageDto: UpdateStageDto): Promise<Stage> {
    const stage = await this.stageRepository.findOne({ where: { id } });
    // this.eventEmitter.emit(
    //   'user.created',
    //   new RegisterUserEvent({ email: 'createClientDto.email', activationLink: 'activationLink' }),
    // );
    if (!stage) throw new NotExistsError('stage');
    return this.stageRepository.save({ id, ...updateStageDto });
  }
}
