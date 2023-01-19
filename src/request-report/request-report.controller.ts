import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { CreateRequestReportDto } from './dto/create-request-report.dto';
import { UpdateRequestReportDto } from './dto/update-request-report.dto';
import { RequestReportService } from './request-report.service';

@ApiAuth()
@ApiTags('Request Report')
@Controller('request-report')
export class RequestReportController {
  constructor(private readonly requestReportService: RequestReportService) {}

  @Post()
  create(@Body() createRequestReportDto: CreateRequestReportDto) {
    return this.requestReportService.create(createRequestReportDto);
  }

  @Get()
  findAll() {
    return this.requestReportService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestReportDto: UpdateRequestReportDto) {
    return this.requestReportService.update(+id, updateRequestReportDto);
  }
}
