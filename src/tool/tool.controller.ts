import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/common/pagination/paginate.dto';
import { PaginatedQuery } from 'src/common/pagination/paginated-query.dto';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolResponseDto } from './dto/tool-response.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool } from './entities/tool.entity';
import { ToolService } from './tool.service';

@ApiAuth()
@ApiTags('Tools')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @ApiResponses({
    201: ToolResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Tool })
  async create(@Body() createToolDto: CreateToolDto) {
    return new ToolResponseDto(await this.toolService.create(createToolDto));
  }

  @ApiResponses({
    200: PaginatedResponse(ToolResponseDto),
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Tool })
  async getAll(@Query() query: PaginatedQuery) {
    const [data, total] = await this.toolService.getAll(query);
    return {
      data: data.map((i) => new ToolResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: ToolResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Tool })
  async get(@Param('id') id: string) {
    return new ToolResponseDto(await this.toolService.get(+id));
  }

  @ApiResponses({
    200: ToolResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Tool })
  async update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return new ToolResponseDto(await this.toolService.update(+id, updateToolDto));
  }

  @ApiResponses({
    200: ToolResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Tool })
  async remove(@Param('id') id: string) {
    return new ToolResponseDto(await this.toolService.remove(+id));
  }
}
