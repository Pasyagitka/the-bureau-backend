import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User]), AbilityModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
