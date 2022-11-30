import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { BrigadierTool } from 'src/brigadier/entities/brigadier-tool.entity';
import { RequestTool } from 'src/request/entities/request-tool.entity';
import { Stage } from 'src/request/entities/stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tool, Stage, RequestTool, BrigadierTool])],
  controllers: [ToolController],
  providers: [ToolService],
})
export class ToolModule {}
