import { Body, Controller, Get, Param, Patch, Post, Req, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { BrigadierRequestResponseDto } from './dto/brigadier-request-response.dto';
import { CalendarResponseDto } from './dto/calendar-response.dto';
import { ClientRequestResponseDto } from './dto/client-request-response.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { RequestAccessoryResponseDto } from './dto/request-accessory-response.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { RequestToolResponseDto } from './dto/request-tool-response.dto';
import { UpdateRequestByAdminDto } from './dto/update-request-by-admin.dto';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { Request } from './entities/request.entity';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';
import { MailService } from '../common/mail/mail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiAuth()
@ApiTags('Requests')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly requestRep: RequestRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  @ApiResponses({
    201: RequestResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Request })
  async create(@Body() createRequestDto: CreateRequestDto, @Req() req) {
    return new RequestResponseDto(await this.requestService.create(createRequestDto, req.user));
  }

  @ApiResponses({
    200: [ReportResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Get weekly report (schedule) for all brigadiers (admin)',
  })
  @Get('/weekly-report')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReport() {
    return (await this.requestService.getWeeklyReport()).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: [CalendarResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Get calendar (schedule) for all brigadiers (admin)',
  })
  @Get('/calendar')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getCalendar() {
    return (await this.requestService.getCalendar()).map((i) => new CalendarResponseDto(i));
  }

  @ApiResponses({
    200: [CalendarResponseDto],
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get calendar (schedule) for obe brigadier' })
  @Get('/calendar/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getCalendarForBrigadier(@Param('brigadierId') brigadierId: number) {
    return (await this.requestService.getCalendar(brigadierId)).map((i) => new CalendarResponseDto(i));
  }

  @ApiResponses({
    200: [ReportResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get weekly report (schedule) for one brigadier' })
  @Get('/weekly-report/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReportForBrigadier(@Param('brigadierId') id: string) {
    return (await this.requestService.getWeeklyReportForBrigadier(+id)).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: [RequestResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Request })
  async findAll() {
    return (await this.requestService.findAll()).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: RequestResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async get(@Param('id') id: string): Promise<RequestResponseDto> {
    const req = await this.requestService.get(+id);
    const dto = new RequestResponseDto(req);
    return dto;
  }

  @ApiResponses({
    200: [RequestToolResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get tools for request (based on stage)' })
  @Get(':id/tools')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getTools(@Param('id') id: string) {
    return (await this.requestService.getRequestTools(+id)).map((i) => new RequestToolResponseDto(i));
  }

  @ApiResponses({
    200: [RequestAccessoryResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Get accessories for request (based on request equipment)',
  })
  @Get(':id/accessories')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getAccessories(@Param('id') id: string) {
    return (await this.requestService.getRequestAccessories(+id)).map((i) => new RequestAccessoryResponseDto(i));
  }

  @ApiResponses({
    200: [BrigadierRequestResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get all requests for brigadier' })
  @Get('brigadier/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getBrigadierRequests(@Param('brigadierId') id: string, @Req() req) {
    return (await this.requestService.getBrigadierRequests(+id, req.user)).map(
      (i) => new BrigadierRequestResponseDto(i),
    );
  }

  @ApiResponses({
    200: [ClientRequestResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get all requests for client' })
  @Get('client/:clientId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getClientRequests(@Param('clientId') id: string, @Req() req) {
    return (await this.requestService.getClientRequests(+id, req.user)).map((i) => new ClientRequestResponseDto(i));
  }

  @ApiResponses({
    200: StreamableFile,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get full report for request (.docx)' })
  @Get(':id/report')
  async getFullReport(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    const report = await this.requestService.getFullReport(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="request-${id}-report.docx`,
    });
    return new StreamableFile(report);
  }

  @ApiResponses({
    200: RequestResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Update request status (Accepted, Completed) (brigadier)',
  })
  @Patch('brigadier/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  async updateByBrigadier(
    @Param('id') id: string,
    @Body() updateRequestStatusDto: UpdateRequestByBrigadierDto,
    @Req() req,
  ) {
    const res = await this.requestService.updateByBrigadier(+id, updateRequestStatusDto, req.user);
    this.eventEmitter.emit('request.statusChanged', {
      email: res.client.user.email,
      address: res.address,
      status: res.status,
    });
    return new RequestResponseDto(res);
  }

  @ApiResponses({
    200: RequestResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Update request status (all) (admin)' })
  @Patch('admin/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  async updateByAdmin(@Param('id') id: string, @Body() updateRequestBrigadierDto: UpdateRequestByAdminDto) {
    const res = await this.requestService.updateByAdmin(+id, updateRequestBrigadierDto);
    if (updateRequestBrigadierDto.brigadier) {
      this.eventEmitter.emit('request.brigadierChanged', {
        email: res.brigadierEmail,
        address: `${res.address?.city || ''}, ул.${res.address?.street || ''}, дом ${res.address?.house || ''} ${
          res.address?.flat || ''
        }`,
      });
    }
    return new RequestResponseDto(res);
  }
}
