import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@ApiBearerAuth()
@ApiTags('Schedules')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Schedule })
  getBrigadierSchedule(@Param('id') id: string, @Req() req) {
    return this.scheduleService.getBrigadierSchedule(+id, req.user);
  }
}
