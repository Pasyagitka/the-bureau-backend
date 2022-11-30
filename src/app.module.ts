import * as winston from 'winston';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { DataSource } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { RequestModule } from './request/request.module';
import { UserModule } from './user/user.module';
import { AccessoryModule } from './accessory/accessory.module';
import { BrigadierModule } from './brigadier/brigadier.module';
import { ClientModule } from './client/client.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ToolModule } from './tool/tool.module';
import { User } from './user/entities/user.entity';
import { Accessory } from './accessory/entities/accessory.entity';
import { Brigadier } from './brigadier/entities/brigadier.entity';
import { Client } from './client/entities/client.entity';
import { Equipment } from './equipment/entities/equipment.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { Tool } from './tool/entities/tool.entity';
import { Request } from './request/entities/request.entity';
import { BrigadierTool } from './brigadier/entities/brigadier-tool.entity';
import { Report } from './request/entities/report.entity';
import { RequestAccessory } from './request/entities/request-accessory.entity';
import { RequestEquipment } from './request/entities/request-equipment.entity';
import { RequestTool } from './request/entities/request-tool.entity';
import { Stage } from './request/entities/stage.entity';
import { Address } from './request/entities/address.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { ForbiddenAbilityFilter } from './ability/filters/forbidden-ability.filter';
import { AbilityModule } from './ability/ability.module';
import { RequestSubscriber } from './request/subscribers/request.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(), //todo move configs
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
      entities: [
        Equipment,
        Accessory,
        User,
        Client,
        Address,
        Stage,
        Tool,
        Brigadier,
        BrigadierTool,
        Request,
        RequestAccessory,
        RequestEquipment,
        RequestTool,
        Report,
        Schedule,
      ], //TODO add migrations
      // subscribers: [RequestSubscriber],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(process.env.API_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    AuthModule,
    RequestModule,
    UserModule,
    AccessoryModule,
    BrigadierModule,
    ClientModule,
    EquipmentModule,
    ScheduleModule,
    ToolModule,
    AbilityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ForbiddenAbilityFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
