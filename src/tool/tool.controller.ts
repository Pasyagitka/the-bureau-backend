import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { CheckAbilities } from 'src/casl/abilities.decorator';
import { Action } from 'src/casl/actions.enum';
import { Tool } from './entities/tool.entity';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Tool })
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Tool })
  getAll() {
    return this.toolService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Tool })
  get(@Param('id') id: string) {
    return this.toolService.get(+id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Tool })
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Tool })
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
