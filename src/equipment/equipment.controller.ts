import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentResponseDto } from './dto/equipment-response.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentService } from './equipment.service';

@ApiAuth()
@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @ApiResponses({
    201: EquipmentResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Equipment })
  async create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return new EquipmentResponseDto(await this.equipmentService.create(createEquipmentDto));
  }

  @ApiResponses({
    200: [EquipmentResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Equipment })
  async getAll() {
    return (await this.equipmentService.getAll()).map((i) => new EquipmentResponseDto(i));
  }

  @ApiResponses({
    200: EquipmentResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Equipment })
  async get(@Param('id') id: string) {
    return new EquipmentResponseDto(await this.equipmentService.get(+id));
  }

  @ApiResponses({
    200: EquipmentResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Equipment })
  async update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return new EquipmentResponseDto(await this.equipmentService.update(+id, updateEquipmentDto));
  }

  @ApiResponses({
    200: EquipmentResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Equipment })
  async remove(@Param('id') id: string) {
    return new EquipmentResponseDto(await this.equipmentService.remove(+id));
  }
}
