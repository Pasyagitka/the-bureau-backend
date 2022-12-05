import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Request } from './entities/request.entity';
import { Action } from 'src/ability/types';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { UpdateRequestByAdminDto } from './dto/update-request-by-admin.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Request })
  create(@Body() createRequestDto: CreateRequestDto, @Req() req) {
    return this.requestService.create(createRequestDto, req.user);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Request })
  getAll() {
    return this.requestService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Request })
  get(@Param('id') id: string) {
    return this.requestService.get(+id);
  }

  @Get(':id/tools')
  @CheckAbilities({ action: Action.Read, subject: Request })
  getTools(@Param('id') id: string) {
    return this.requestService.getRequestTools(+id);
  }

  @Get(':id/accessories')
  @CheckAbilities({ action: Action.Read, subject: Request })
  getAccessories(@Param('id') id: string) {
    return this.requestService.getRequestAccessories(+id);
  }

  @Get('brigadier/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  getBrigadierRequests(@Param('brigadierId') id: string, @Req() req) {
    return this.requestService.getBrigadierRequests(+id, req.user);
  }

  @Get('client/:clientId')
  @CheckAbilities({ action: Action.Read, subject: Request })
  getClientRequests(@Param('clientId') id: string, @Req() req) {
    return this.requestService.getClientRequests(+id, req.user);
  }

  @Get(':id/equipment')
  @CheckAbilities({ action: Action.Read, subject: Request })
  getWithEquipment(@Param('id') id: string) {
    return this.requestService.getRequestWithEquipment(+id);
  }

  // @Put(':id')
  // @CheckAbilities({ action: Action.Update, subject: Request })
  // update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @Req() req) {
  //   return this.requestService.update(+id, updateRequestDto, req.user);
  // }

  @Put('brigadier/update/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  updateByBrigadier(
    @Param('id') id: string,
    @Body() updateRequestStatusDto: UpdateRequestByBrigadierDto,
    @Req() req,
  ) {
    return this.requestService.updateByBrigadier(+id, updateRequestStatusDto, req.user);
  }

  @Put('admin/update/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  updateByAdmin(
    @Param('id') id: string,
    @Body() updateRequestBrigadierDto: UpdateRequestByAdminDto,
  ) {
    return this.requestService.updateByAdmin(+id, updateRequestBrigadierDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Request })
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
