import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  //TODO retrieve all schedule history for admin

  //TODO if is soft deleted children are inserted already soft deleted
  async addRecord(createScheduleDto) {
    const items = await this.scheduleRepository.find({
      relations: { request: true, brigadier: true },
      where: { request: { id: createScheduleDto.request } },
    });
    await this.scheduleRepository.softRemove(items);
    return await this.scheduleRepository.save(createScheduleDto);
  }

  async removeByRequestId(requestId: number) {
    const items = await this.scheduleRepository.find({
      relations: { request: true, brigadier: true },
      where: { request: { id: requestId } },
    });
    return await this.scheduleRepository.softRemove(items);
  }
}
