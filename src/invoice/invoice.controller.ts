import { Controller, Post, Body } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Accessory } from '../accessory/entities/accessory.entity';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { Action } from '../ability/types';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@ApiAuth()
@ApiTags('Invoices')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiResponses({
    201: MessageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Accessory })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }
}
