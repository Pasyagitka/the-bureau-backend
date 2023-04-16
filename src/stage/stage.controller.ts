import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { StageResponseDto } from './../request/dto/brigadier-request-response.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
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
  async findAll() {
    return (await this.stageService.findAll()).map((i) => new StageResponseDto(i));
  }

  @ApiResponses({
    200: StageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Stage })
  async update(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return new StageResponseDto(await this.stageService.update(+id, updateStageDto));
  }
}
