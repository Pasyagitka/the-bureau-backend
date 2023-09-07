import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { PaginatedResponse } from '../common/pagination/paginate.dto';
import { PaginatedResponseDto } from '../common/pagination/paginated-response.dto';
import { AccessoryService } from './accessory.service';
import { AccessoryResponseDto } from './dto/accessory-response.dto';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';
import { FindAllQueryDto } from './dto/findAll-query.dto';
import { Response } from 'express';

import { FileUpload } from 'src/common/decorators/file-upload.decorator';

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
    201: [AccessoryResponseDto],
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Import accessories from .csv' })
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  @FileUpload()
  @Post('/import')
  async import(@UploadedFile() file: Express.Multer.File) {
    const [data, total] = await this.accessoryService.import(file);
    return {
      data: data.map((i) => new AccessoryResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: StreamableFile,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Export accessories to .csv' })
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  @Post('/export')
  async export(@Res({ passthrough: true }) res: Response) {
    const data = await this.accessoryService.export();
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="accessories.csv"`,
    });
    return data;
  }

  @ApiResponses({
    200: PaginatedResponse(AccessoryResponseDto),
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get accessories (paginated)' })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  async findAll(@Query() query: FindAllQueryDto): Promise<PaginatedResponseDto<AccessoryResponseDto>> {
    const [data, total] = await this.accessoryService.findAll(query);
    return {
      data: data.map((i) => new AccessoryResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: [AccessoryResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get accessories available for invoice' })
  @Get('available/')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  @ApiOperation({ summary: 'Get accessory' })
  async getAvaliableForInvoice(): Promise<AccessoryResponseDto[]> {
    return (await this.accessoryService.getAvaliableForInvoice()).map((i) => new AccessoryResponseDto(i));
  }

  @ApiResponses({
    200: AccessoryResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  @ApiOperation({ summary: 'Get accessory' })
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
