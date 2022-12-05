import { Controller, Get, Param } from '@nestjs/common';
import { StageService } from './stage.service';

@Controller('stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Get()
  findAll() {
    return this.stageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stageService.findOne(+id);
  }
}
