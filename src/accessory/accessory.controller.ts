import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { AccessoryService } from './accessory.service';
import { AccessoryResponseDto } from './dto/accessory-response.dto';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';

@ApiAuth()
@ApiTags('Accessories')
@Controller('accessory')
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @ApiResponse({status: 201, type: AccessoryResponseDto})
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  async create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return new AccessoryResponseDto(await this.accessoryService.create(createAccessoryDto));
  }

  @ApiResponse({status: 200, type: AccessoryResponseDto, isArray: true})
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async getAll() {
    return (await this.accessoryService.getAll()).map((i) => new AccessoryResponseDto(i));
  }

  @ApiResponse({status: 200, type: AccessoryResponseDto})
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async get(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.get(+id));
  }

  @ApiResponse({status: 200, type: AccessoryResponseDto})
  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Accessory })
  async update(@Param('id') id: string, @Body() updateAccessoryDto: UpdateAccessoryDto) {
    return new AccessoryResponseDto(await this.accessoryService.update(+id, updateAccessoryDto));
  }

  @ApiResponses({
    200: AccessoryResponseDto,
    400: ErrorMessageResponseDto, 
    404: ErrorMessageResponseDto, 
    500: ErrorMessageResponseDto
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Accessory })
  async remove(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.remove(+id));
  }
}
