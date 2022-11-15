import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BrigadierService } from './brigadier.service';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';

@Controller('brigadier')
export class BrigadierController {
  constructor(private readonly brigadierService: BrigadierService) {}

  @Post()
  create(
    @Body() createBrigadierDto: CreateBrigadierDto,
    @Body() CreateUserDto: CreateUserDto,
  ) {
    return this.brigadierService.createWithUser(
      createBrigadierDto,
      CreateUserDto,
    );
  }

  @Get()
  getAll() {
    return this.brigadierService.getAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.brigadierService.get(+id);
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
