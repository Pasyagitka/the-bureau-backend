import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { BaseController } from 'src/base/base.controller';
import { Tool } from './entities/tool.entity';

@Controller('tool')
export class ToolController extends BaseController<Tool> {
  constructor(private readonly toolService: ToolService) {
    super(toolService);
  }

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  getAll() {
    return this.toolService.getAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.toolService.get(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
