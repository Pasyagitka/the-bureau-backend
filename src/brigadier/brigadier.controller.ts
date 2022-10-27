import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrigadierService } from './brigadier.service';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';

@Controller('brigadier')
export class BrigadierController {
  constructor(private readonly brigadierService: BrigadierService) {}

  @Post()
  create(@Body() createBrigadierDto: CreateBrigadierDto) {
    return this.brigadierService.create(createBrigadierDto);
  }

  @Get()
  findAll() {
    return this.brigadierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brigadierService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrigadierDto: UpdateBrigadierDto,
  ) {
    return this.brigadierService.update(+id, updateBrigadierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brigadierService.remove(+id);
  }
}
