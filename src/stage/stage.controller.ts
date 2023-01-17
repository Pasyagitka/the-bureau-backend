import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { Stage } from './entities/stage.entity';
import { StageService } from './stage.service';

@ApiAuth()
@ApiTags('Stages')
@Controller('stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Stage })
  getAll() {
    return this.stageService.getAll();
  }
}
