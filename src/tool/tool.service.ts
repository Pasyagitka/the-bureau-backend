import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError, NotExistsError } from 'src/common/exceptions';
import { Stage } from 'src/stage/entities/stage.entity';
import { Repository } from 'typeorm';
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

  async getAll(): Promise<Tool[]> {
    return this.toolsRepository.find();
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
    return this.toolsRepository.save({ id, ...updateToolDto });
  }

  async remove(id: number): Promise<Tool> {
    const item = await this.toolsRepository.findOne({
      where: { id },
      relations: ['requestTools', 'brigadierTools'],
    });
    if (!item) throw new NotExistsError('tool');
    return this.toolsRepository.softRemove(item);
  }
}
