import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { PaginatedResponse } from 'src/common/pagination/paginate.dto';
import { PaginatedQuery } from 'src/common/pagination/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/pagination/paginated-response.dto';
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

  @ApiResponses({
    201: AccessoryResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  async create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return new AccessoryResponseDto(await this.accessoryService.create(createAccessoryDto));
  }

  @ApiResponses({
    200: PaginatedResponse(AccessoryResponseDto),
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async getAll(@Query() query: PaginatedQuery): Promise<PaginatedResponseDto<AccessoryResponseDto>> {
    const [data, total] = await this.accessoryService.getAll(query);
    return {
      data: data.map((i) => new AccessoryResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: AccessoryResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async get(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.get(+id));
  }

  @ApiResponses({
    200: AccessoryResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Accessory })
  async update(@Param('id') id: string, @Body() updateAccessoryDto: UpdateAccessoryDto) {
    await this.accessoryService.update(+id, updateAccessoryDto);
    return new AccessoryResponseDto(await this.accessoryService.get(+id));
  }

  @ApiResponses({
    200: AccessoryResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Accessory })
  async remove(@Param('id') id: string) {
    return new AccessoryResponseDto(await this.accessoryService.remove(+id));
  }
}
