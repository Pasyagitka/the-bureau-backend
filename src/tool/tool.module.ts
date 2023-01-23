import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrigadierTool } from '../brigadier/entities/brigadier-tool.entity';
import { Stage } from '../stage/entities/stage.entity';
import { Tool } from './entities/tool.entity';
import { ToolController } from './tool.controller';
import { ToolService } from './tool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tool, Stage, BrigadierTool])],
  controllers: [ToolController],
  providers: [ToolService],
})
export class ToolModule {}
