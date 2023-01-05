import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiBearerAuth, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { AccessoryService } from './accessory.service';
import { AccessoryResponseDto } from './dto/accessory-response.dto';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';

@ApiBearerAuth()
@ApiTags('Accessories')
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
  async getAll() {
    return (await this.accessoryService.getAll()).map((i) => new AccessoryResponseDto(i));
    //return this.accessoryService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async get(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.get(+id));
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Accessory })
  async update(@Param('id') id: string, @Body() updateAccessoryDto: UpdateAccessoryDto) {
    return new AccessoryResponseDto(await this.accessoryService.update(+id, updateAccessoryDto));
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Accessory })
  async remove(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.remove(+id));
  }
}
