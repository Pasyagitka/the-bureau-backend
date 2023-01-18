import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { BrigadierRequestResponseDto } from './dto/brigadier-request-response.dto';
import { ClientRequestResponseDto } from './dto/client-request-response.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { RequestAccessoryResponseDto } from './dto/request-accessory-response.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { RequestToolResponseDto } from './dto/request-tool-response.dto';
import { UpdateRequestByAdminDto } from './dto/update-request-by-admin.dto';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { Request } from './entities/request.entity';
import { RequestService } from './request.service';

@ApiAuth()
@ApiTags('Requests')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

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
  @Get('/weekly-report')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReport() {
    return (await this.requestService.getWeeklyReport()).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: [ReportResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('/weekly-report/:id')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getWeeklyReportForBrigadier(@Param('id') id: string) {
    return (await this.requestService.getWeeklyReportForBrigadier(+id)).map((i) => new RequestResponseDto(i));
  }

  @ApiResponses({
    200: [RequestResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getAll() {
    return (await this.requestService.getAll()).map((i) => new RequestResponseDto(i));
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
  @Get('client/:clientId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  async getClientRequests(@Param('clientId') id: string, @Req() req) {
    return (await this.requestService.getClientRequests(+id, req.user)).map((i) => new ClientRequestResponseDto(i));
  }

  // @ApiResponses({
  //   200: [RequestEquipmentResponseDto],
  //   404: ErrorMessageResponseDto,
  //   500: ErrorMessageResponseDto,
  // })
  // @Get(':id/equipment')
  // @CheckAbilities({ action: Action.Read, subject: Request })
  // async getWithEquipment(@Param('id') id: string) {
  //   return (await this.requestService.getRequestWithEquipment(+id)).map((i) => new RequestEquipmentResponseDto(i));
  // }

  @ApiResponses({
    200: RequestResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch('brigadier/update/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  async updateByBrigadier(
    @Param('id') id: string,
    @Body() updateRequestStatusDto: UpdateRequestByBrigadierDto,
    @Req() req,
  ) {
    return new RequestResponseDto(await this.requestService.updateByBrigadier(+id, updateRequestStatusDto, req.user));
  }

  @ApiResponses({
    200: RequestResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch('admin/update/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  async updateByAdmin(@Param('id') id: string, @Body() updateRequestBrigadierDto: UpdateRequestByAdminDto) {
    return new RequestResponseDto(await this.requestService.updateByAdmin(+id, updateRequestBrigadierDto));
  }

  @ApiResponses({
    200: RequestResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Request })
  async remove(@Param('id') id: string) {
    return new RequestResponseDto(await this.requestService.remove(+id));
  }
}
