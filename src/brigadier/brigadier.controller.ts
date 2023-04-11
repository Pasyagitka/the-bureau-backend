import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { BrigadierService } from './brigadier.service';
import { BrigadierResponseDto } from './dto/brigadier-response.dto';
import { RecommendedBrigadierResponseDto } from './dto/recommended-brigadier-response.dto';
import { RecommendedQuery } from './dto/recommended-query.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';
import { Brigadier } from './entities/brigadier.entity';

@ApiAuth()
@ApiTags('Brigadiers')
@Controller('brigadier')
export class BrigadierController {
  constructor(private readonly brigadierService: BrigadierService) {}

  @ApiResponses({
    200: [BrigadierResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Brigadier })
  async findAll() {
    return (await this.brigadierService.findAll()).map((i) => new BrigadierResponseDto(i));
  }

  @ApiResponses({
    200: [RecommendedBrigadierResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get('/recommended')
  @CheckAbilities({ action: Action.Read, subject: Brigadier })
  async getRecommendedBrigadiers(@Query() query: RecommendedQuery) {
    return (await this.brigadierService.getAvailableForDate(query)).map((i) => new RecommendedBrigadierResponseDto(i));
  }

  @ApiResponses({
    200: BrigadierResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Brigadier })
  async get(@Param('id') id: string) {
    return new BrigadierResponseDto(await this.brigadierService.get(+id));
  }

  @ApiResponses({
    200: BrigadierResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Brigadier })
  async update(@Param('id') id: string, @Body() updateBrigadierDto: UpdateBrigadierDto, @Req() req) {
    return new BrigadierResponseDto(await this.brigadierService.update(+id, updateBrigadierDto, req.user));
  }

  @ApiResponses({
    200: BrigadierResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Brigadier })
  async remove(@Param('id') id: string) {
    return new BrigadierResponseDto(await this.brigadierService.remove(+id));
  }
}
