import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { Accessory } from '../accessory/entities/accessory.entity';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { RequestReportResponseDto } from './dto/request-report.response.dto';
import { RequestReportService } from './request-report.service';
import { UpsertRequestReportDto } from './dto/upsert-request-report.dto';

@ApiAuth()
@ApiTags('Request Report')
@Controller(':requestId/request-report')
export class RequestReportController {
  constructor(private readonly requestReportService: RequestReportService) {}

  @ApiResponses({
    201: RequestReportResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  upsert(@Param('requestId') requestId: number, @Body() createRequestReportDto: [UpsertRequestReportDto]) {
    return this.requestReportService.upsert(requestId, createRequestReportDto);
  }

  @ApiResponses({
    200: [RequestReportResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Accessory })
  findAll(@Param('requestId') requestId: number) {
    return this.requestReportService.findAll(requestId);
  }
}
