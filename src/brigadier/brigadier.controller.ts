import { Body, Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { AccessoryResponseDto } from 'src/accessory/dto/accessory-response.dto';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { BrigadierService } from './brigadier.service';
import { BrigadierResponseDto } from './dto/brigadier-response.dto';
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
  async getAll() {
    return (await this.brigadierService.getAll()).map((i) => new AccessoryResponseDto(i));
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
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Brigadier })
  async remove(@Param('id') id: string) {
    return new BrigadierResponseDto(await this.brigadierService.remove(+id));
  }
}
