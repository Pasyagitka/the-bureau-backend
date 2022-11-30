import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { NotExistsError } from 'src/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async addRecord(createScheduleDto: CreateScheduleDto) {
    await this.removeByRequestId(createScheduleDto.request);
    const scheduleRecord = this.scheduleRepository.create({
      brigadier: { id: createScheduleDto.brigadier },
      request: { id: createScheduleDto.request },
    });
    return await this.scheduleRepository.save(scheduleRecord);
  }

  async getBrigadierSchedule(brigadierId: number, user: User) {
    const brigadier = await this.brigadierRepository.find({ where: { id: brigadierId } });
    if (!brigadier) throw new NotExistsError('brigadier');
    const schedule = await this.scheduleRepository.find({
      where: { brigadier: { id: brigadierId } },
      loadRelationIds: true,
    });

    if (schedule.length > 0) {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, schedule[0]);
    }
    return schedule;
  }

  async removeByRequestId(requestId: number) {
    const items = await this.scheduleRepository.find({
      relations: { request: true, brigadier: true },
      where: { request: { id: requestId } },
    });
    return await this.scheduleRepository.softRemove(items);
  }
}
