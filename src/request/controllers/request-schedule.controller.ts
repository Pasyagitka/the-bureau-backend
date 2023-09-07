import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../common/decorators/auth.decorator';
import { RequestService } from '../services/request.service';
import { CheckAbilities } from '../../ability/decorators/abilities.decorator';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { CalendarResponseDto } from '../dto/calendar-response.dto';
import { ReportResponseDto } from '../dto/report-response.dto';
import { RequestResponseDto } from '../dto/request-response.dto';
import { Action } from '../../ability/types';
import { Request } from '../entities/request.entity';

@ApiAuth()
@ApiTags('Request Schedule')
@Controller('request')
export class RequestScheduleController {
  constructor(private readonly requestService: RequestService) {}

  @ApiResponses({
    200: [ReportResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Get weekly report (schedule) for all brigadiers (admin)',
  })
  @Get('/weekly-report')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReport() {
    return (await this.requestService.getWeeklyReport()).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: [CalendarResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Get calendar (schedule) for all brigadiers (admin)',
  })
  @Get('/calendar')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getCalendar() {
    return (await this.requestService.getCalendar()).map((i) => new CalendarResponseDto(i));
  }

  @ApiResponses({
    200: [CalendarResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get calendar (schedule) for obe brigadier' })
  @Get('/calendar/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getCalendarForBrigadier(@Param('brigadierId') brigadierId: number) {
    return (await this.requestService.getCalendar(brigadierId)).map((i) => new CalendarResponseDto(i));
  }

  @ApiResponses({
    200: [ReportResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get weekly report (schedule) for one brigadier' })
  @Get('/weekly-report/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReportForBrigadier(@Param('brigadierId') id: string) {
    return (await this.requestService.getWeeklyReportForBrigadier(+id)).map((i) => new RequestResponseDto(i));
  }
}
