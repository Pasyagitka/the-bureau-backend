import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrigadierService } from './brigadier.service';
import { BrigadierController } from './brigadier.controller';
import { BrigadierTool } from './entities/brigadier-tool.entity';
import { Brigadier } from './entities/brigadier.entity';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Request } from 'src/request/entities/request.entity';
import { Tool } from 'src/tool/entities/tool.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Brigadier,
      BrigadierTool,
      Tool,
      Request,
      Schedule,
    ]),
  ],
  controllers: [BrigadierController],
  providers: [BrigadierService],
})
export class BrigadierModule {}
