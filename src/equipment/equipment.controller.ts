import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentService } from './equipment.service';

@ApiAuth()
@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Equipment })
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Equipment })
  getAll() {
    return this.equipmentService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Equipment })
  get(@Param('id') id: string) {
    return this.equipmentService.get(+id);
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Equipment })
  update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.update(+id, updateEquipmentDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Equipment })
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }
}
