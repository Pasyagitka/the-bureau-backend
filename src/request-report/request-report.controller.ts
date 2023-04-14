import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { Accessory } from '../accessory/entities/accessory.entity';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { RequestReportResponseDto } from './dto/request-report.response.dto';
import { RequestReportService } from './request-report.service';
import { PatchRequestReportDto } from './dto/patch-request-report.dto';
import { Patch, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiAuth()
@ApiTags('Request Report')
@Controller('request-report/:requestId')
export class RequestReportController {
  constructor(private readonly requestReportService: RequestReportService) {}

  @ApiResponses({
    201: RequestReportResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  //@CheckAbilities({ action: Action.Create, subject: Accessory })
  patch(@Param('requestId') requestId: number, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.requestReportService.patch(requestId, files);
  }

  @ApiResponses({
    200: [RequestReportResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  //@CheckAbilities({ action: Action.Read, subject: Accessory })
  findAll(@Param('requestId') requestId: number) {
    return this.requestReportService.findAll(requestId);
  }
}
