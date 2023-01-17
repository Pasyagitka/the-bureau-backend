import { Controller, Get, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { BrigadierService } from './brigadier.service';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';
import { Brigadier } from './entities/brigadier.entity';

@ApiAuth()
@ApiTags('Brigadiers')
@Controller('brigadier')
export class BrigadierController {
  constructor(private readonly brigadierService: BrigadierService) {}

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
  update(@Param('id') id: string, @Body() updateBrigadierDto: UpdateBrigadierDto, @Req() req) {
    return this.brigadierService.update(+id, updateBrigadierDto, req.user);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Brigadier })
  remove(@Param('id') id: string) {
    return this.brigadierService.remove(+id);
  }
}
