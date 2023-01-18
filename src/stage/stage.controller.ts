import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { StageResponseDto } from './../request/dto/brigadier-request-response.dto';
import { Stage } from './entities/stage.entity';
import { StageService } from './stage.service';

@ApiAuth()
@ApiTags('Stages')
@Controller('stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @ApiResponses({
    200: [StageResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Stage })
  async getAll() {
    return (await this.stageService.getAll()).map((i) => new StageResponseDto(i));
  }
}
