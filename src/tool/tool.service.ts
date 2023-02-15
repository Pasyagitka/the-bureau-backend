import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedQuery } from 'src/common/pagination/paginated-query.dto';
import { Repository } from 'typeorm';
import { AlreadyExistsError, NotExistsError } from '../common/exceptions';
import { Stage } from '../stage/entities/stage.entity';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool } from './entities/tool.entity';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool)
    private toolsRepository: Repository<Tool>,
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
  ) {}

  async findAll(query: PaginatedQuery) {
    return this.toolsRepository.findAndCount({
      relations: { stage: true },
      order: { id: 'ASC' },
      skip: query.offset,
      take: query.limit,
    });
  }

  async get(id: number): Promise<Tool> {
    const item = await this.toolsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotExistsError('tool');
    }
    return item;
  }

  async create(createToolDto: CreateToolDto): Promise<Tool> {
    const tool = await this.toolsRepository.findOne({
      where: { name: createToolDto.name },
    });
    if (tool) throw new AlreadyExistsError('tool');

    const stage = await this.stageRepository.findOne({
      where: { id: createToolDto.stageId },
    });
    if (!stage) throw new NotExistsError('stage');

    const item = this.toolsRepository.create(createToolDto);
    item.stage = stage;
    await this.toolsRepository.save(item);
    return item;
  }

  async update(id: number, updateToolDto: UpdateToolDto): Promise<Tool> {
    const tool = await this.toolsRepository.findOne({ where: { id } });
    if (!tool) throw new NotExistsError('tool');

    const stage = await this.stageRepository.findOne({
      where: { id: updateToolDto.stageId },
    });
    if (!stage) throw new NotExistsError('stage');
    tool.stage = stage;
    tool.name = updateToolDto.name;
    return this.toolsRepository.save(tool);
  }

  async remove(id: number): Promise<Tool> {
    const item = await this.toolsRepository.findOne({
      where: { id },
      relations: ['brigadierTools'],
    });
    if (!item) throw new NotExistsError('tool');
    return this.toolsRepository.softRemove(item);
  }
}
