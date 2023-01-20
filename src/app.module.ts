import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { DataSource } from 'typeorm';
import * as winston from 'winston';
import { AbilityModule } from './ability/ability.module';
import { ForbiddenAbilityFilter } from './ability/filters/forbidden-ability.filter';
import { AccessoryModule } from './accessory/accessory.module';
import { Accessory } from './accessory/entities/accessory.entity';
import { AuthModule } from './auth/auth.module';
import { BrigadierModule } from './brigadier/brigadier.module';
import { BrigadierTool } from './brigadier/entities/brigadier-tool.entity';
import { Brigadier } from './brigadier/entities/brigadier.entity';
import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { MailModule } from './common/mail/mail.module';
import { Equipment } from './equipment/entities/equipment.entity';
import { EquipmentModule } from './equipment/equipment.module';
import { Rental } from './rental/entities/rental.entity';
import { RentalModule } from './rental/rental.module';
import { RequestReport } from './request-report/entities/request-report.entity';
import { RequestReportModule } from './request-report/request-report.module';
import { Address } from './request/entities/address.entity';
import { RequestEquipment } from './request/entities/request-equipment.entity';
import { Request } from './request/entities/request.entity';
import { RequestModule } from './request/request.module';
import { Schedule } from './schedule/entities/schedule.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { Stage } from './stage/entities/stage.entity';
import { StageModule } from './stage/stage.module';
import { Tool } from './tool/entities/tool.entity';
import { ToolModule } from './tool/tool.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

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
        Accessory,
        Address,
        Brigadier,
        BrigadierTool,
        Equipment,
        Client,
        Stage,
        Tool,
        Request,
        RequestEquipment,
        Rental,
        RequestReport,
        Schedule,
        User,
      ], //TODO add migrations
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
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    AuthModule,
    RequestModule,
    RentalModule,
    UserModule,
    AccessoryModule,
    BrigadierModule,
    ClientModule,
    EquipmentModule,
    ScheduleModule,
    ToolModule,
    AbilityModule,
    MailModule,
    StageModule,
    RequestReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
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
