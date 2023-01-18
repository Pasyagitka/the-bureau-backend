import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@ApiAuth()
@ApiTags('Schedules')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiResponses({
    200: [ScheduleResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Schedule })
  async getBrigadierSchedule(@Param('id') id: string, @Req() req) {
    return (await this.scheduleService.getBrigadierSchedule(+id, req.user)).map((i) => new ScheduleResponseDto(i));
  }
}
