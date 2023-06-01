import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { DataSource } from 'typeorm';
import { AbilityModule } from './ability/ability.module';
import { ForbiddenAbilityFilter } from './ability/filters/forbidden-ability.filter';
import { AccessoryModule } from './accessory/accessory.module';
import { AuthModule } from './auth/auth.module';
import { BrigadierModule } from './brigadier/brigadier.module';
import { ClientModule } from './client/client.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { MailModule } from './common/mail/mail.module';
import dbConfiguration from './config/database.config';
import jwtConfiguration from './config/jwt.config';
import mailConfiguration from './config/mail.config';
import winstonConfiguration from './config/winston.config';
import { EquipmentModule } from './equipment/equipment.module';
import { RequestReportModule } from './request-report/request-report.module';
import { RequestModule } from './request/request.module';
import { ScheduleModule } from './schedule/schedule.module';
import { StageModule } from './stage/stage.module';
import { ToolModule } from './tool/tool.module';
import { UserModule } from './user/user.module';
import { InvoiceModule } from './invoice/invoice.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration, jwtConfiguration, mailConfiguration, winstonConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('database') }),
      // dataSourceFactory: async (options) => {
      //   const appDataSource = new DataSource(options);
      //   try {
      //     await appDataSource.initialize();
      //     console.log('Data Source has been initialized!');
      //     return appDataSource;
      //   } catch (e) {
      //     console.error('Error during Data Source initialization');
      //   }
      // },
      dataSourceFactory: async (options) => new DataSource(options).initialize(),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('mail') }),
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('winston') }),
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    NestScheduleModule.forRoot(),
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
    MailModule,
    StageModule,
    RequestReportModule,
    InvoiceModule,
    CloudinaryModule,
    StatisticsModule,
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
export class AppModule {}
