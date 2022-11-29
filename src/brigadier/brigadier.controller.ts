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
import { BrigadierService } from './brigadier.service';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';
import { Brigadier } from './entities/brigadier.entity';

@Controller('brigadier')
export class BrigadierController {
  constructor(private readonly brigadierService: BrigadierService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Brigadier })
  create(@Body() createBrigadierDto: CreateBrigadierDto) {
    return this.brigadierService.create(createBrigadierDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Brigadier })
  getAll() {
    return this.brigadierService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Brigadier })
  get(@Param('id') id: string) {
    return this.brigadierService.get(+id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Brigadier })
  update(
    @Param('id') id: string,
    @Body() updateBrigadierDto: UpdateBrigadierDto,
  ) {
    return this.brigadierService.update(+id, updateBrigadierDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Brigadier })
  remove(@Param('id') id: string) {
    return this.brigadierService.remove(+id);
  }
}
