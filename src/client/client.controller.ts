import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ClientResponseDto } from '../client/dto/client-response.dto';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@ApiAuth()
@ApiTags('Clients')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiResponses({
    200: [ClientResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Client })
  async findAll() {
    return (await this.clientService.findAll()).map((i) => new ClientResponseDto(i));
  }

  @ApiResponses({
    200: ClientResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Client })
  async get(@Param('id') id: string, @Req() req) {
    return new ClientResponseDto(await this.clientService.get(+id, req.user));
  }

  @ApiResponses({
    200: ClientResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Client })
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Req() req) {
    return new ClientResponseDto(await this.clientService.update(+id, updateClientDto, req.user));
  }
}
