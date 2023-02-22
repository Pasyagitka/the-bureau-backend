import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbilityFactory } from '../ability/ability.factory';
import { Action } from '../ability/types';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { NotExistsError } from '../common/exceptions';
import { User } from '../user/entities/user.entity';
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
    const brigadier = await this.brigadierRepository.findOne({ where: { id: brigadierId } });
    if (!brigadier) throw new NotExistsError('brigadier');
    const schedule = await this.scheduleRepository.find({
      where: { brigadier: { id: brigadierId } },
      select: {
        id: true,
        brigadier: {
          id: true,
        },
        request: {
          id: true,
        },
      },
      relations: {
        brigadier: true,
        request: true,
      },
    });

    //console.log(schedule[0]);

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
