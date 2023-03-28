import { Controller, Post, Body, StreamableFile, Get, Param, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { Action } from '../ability/types';
import { MessageResponseDto } from '../common/dto/message-response.dto';
import { Invoice } from './entities/invoice.entity';
import { Response } from 'express';

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
  @CheckAbilities({ action: Action.Create, subject: Invoice })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @ApiResponses({
    200: StreamableFile,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoice (.docx)' })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Invoice })
  async get(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    const invoice = await this.invoiceService.getInvoice(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="request-${id}-report.docx`,
    });
    return new StreamableFile(invoice);
  }
}
