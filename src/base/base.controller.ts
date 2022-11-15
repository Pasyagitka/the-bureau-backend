import { Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { IBaseService } from './IBase.service';
import { BaseEntity } from './entities/base.entity';

export class BaseController<T extends BaseEntity> {
  constructor(private readonly IBaseService: IBaseService<T>) {}

  @Get()
  async getAll(): Promise<T[]> {
    return this.IBaseService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<T> {
    return this.IBaseService.get(id);
  }

  @Post()
  async create(@Body() entity: T): Promise<T> {
    return this.IBaseService.create(entity);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.IBaseService.remove(id);
  }

  @Put()
  async update(@Param('id') id: string, @Body() entity: T): Promise<T> {
    return this.IBaseService.update(+id, entity);
  }
}
