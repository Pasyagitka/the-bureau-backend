import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from '../ability/ability.module';
import { User } from '../user/entities/user.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User]), AbilityModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
