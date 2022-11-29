import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Schedule } from './entities/schedule.entity';
import { BaseController } from 'src/base/base.controller';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {
    // super(scheduleService);
  }

  //casl

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.addRecord(createScheduleDto);
  }

  // @Get()
  // getAll() {
  //   return this.scheduleService.getAll();
  // }

  // @Get(':id')
  // get(@Param('id') id: string) {
  //   return this.scheduleService.get(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateScheduleDto: UpdateScheduleDto,
  // ) {
  //   return this.scheduleService.update(+id, updateScheduleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scheduleService.remove(+id);
  // }
}
