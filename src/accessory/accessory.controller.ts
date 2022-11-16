import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CheckAbilities } from 'src/casl/abilities.decorator';
import { Action } from 'src/casl/actions.enum';
import { AccessoryService } from './accessory.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';

@Controller('accessory')
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return this.accessoryService.create(createAccessoryDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  getAll() {
    return this.accessoryService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  get(@Param('id') id: string) {
    return this.accessoryService.get(+id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Accessory })
  update(
    @Param('id') id: string,
    @Body() updateAccessoryDto: UpdateAccessoryDto,
  ) {
    return this.accessoryService.update(+id, updateAccessoryDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Accessory })
  remove(@Param('id') id: string) {
    return this.accessoryService.remove(+id);
  }
}
