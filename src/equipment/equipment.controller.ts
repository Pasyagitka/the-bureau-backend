import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  // @CheckAbilities({ action: Action.Create, subject: Equipment })
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  // @CheckAbilities({ action: Action.Read, subject: Equipment })
  getAll() {
    return this.equipmentService.getAll();
  }

  @Get(':id')
  // @CheckAbilities({ action: Action.Read, subject: Equipment })
  get(@Param('id') id: string) {
    return this.equipmentService.get(+id);
  }

  @Put(':id')
  // @CheckAbilities({ action: Action.Update, subject: Equipment })
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(+id, updateEquipmentDto);
  }

  @Delete(':id')
  // @CheckAbilities({ action: Action.Delete, subject: Equipment })
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }
}
