import { Controller, Get, Put, Body, Param, Req } from '@nestjs/common';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Client })
  getAll() {
    return this.clientService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Client })
  get(@Param('id') id: string) {
    return this.clientService.get(+id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: Client })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Req() req) {
    return this.clientService.update(+id, updateClientDto, req.user);
  }
}
