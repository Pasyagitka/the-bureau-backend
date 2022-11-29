import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  //@CheckAbilities({ action: Action.Create, subject: Request })
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  //@CheckAbilities({ action: Action.Read, subject: Request })
  getAll() {
    return this.requestService.getAll();
  }

  @Get(':id')
  //@CheckAbilities({ action: Action.Read, subject: Request })
  get(@Param('id') id: string) {
    return this.requestService.get(+id);
  }

  @Put(':id')
  //@CheckAbilities({ action: Action.Update, subject: Request })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  //@CheckAbilities({ action: Action.Delete, subject: Request })
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
