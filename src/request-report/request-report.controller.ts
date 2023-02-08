import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { CreateRequestReportDto } from './dto/create-request-report.dto';
import { RequestReportResponseDto } from './dto/request-report.response.dto';
import { UpdateRequestReportDto } from './dto/update-request-report.dto';
import { RequestReportService } from './request-report.service';

@ApiAuth()
@ApiTags('Request Report')
@Controller('request-report')
export class RequestReportController {
  constructor(private readonly requestReportService: RequestReportService) {}

  @ApiResponses({
    201: RequestReportResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  create(@Body() createRequestReportDto: CreateRequestReportDto) {
    return this.requestReportService.create(createRequestReportDto);
  }

  @ApiResponses({
    200: [RequestReportResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  findAll() {
    return this.requestReportService.findAll();
  }

  @ApiResponses({
    200: RequestReportResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestReportDto: UpdateRequestReportDto) {
    //return this.requestReportService.update(+id, updateRequestReportDto);
  }
}
