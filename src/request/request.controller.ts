import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Request } from './entities/request.entity';
import { Action } from 'src/ability/types';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { UpdateRequestBrigadierDto } from './dto/update-request-brigadier.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Request })
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
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

  @Put('status/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  updateStatus(
    @Param('id') id: string,
    @Body() updateRequestStatusDto: UpdateRequestByBrigadierDto,
    @Req() req,
  ) {
    return this.requestService.setStatus(+id, updateRequestStatusDto, req.user);
  }
  //можно сделать 1 дто бригадира и 1 админа (статус + бригадир опционально все)

  //todo бригадир может обновлять тоже! надо как-то разделить
  @Put('brigadier/:id')
  @CheckAbilities({ action: Action.Update, subject: Request })
  updateBrigadier(
    @Param('id') id: string,
    @Body() updateRequestBrigadierDto: UpdateRequestBrigadierDto,
  ) {
    return this.requestService.setBrigadier(+id, updateRequestBrigadierDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Request })
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
