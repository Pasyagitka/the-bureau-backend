import {
  Controller,
  Post,
  Body,
  StreamableFile,
  Get,
  Param,
  Res,
  Query,
  Req,
  Delete,
  Patch,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
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
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { PaginatedResponse } from '../common/pagination/paginate.dto';
import { PaginatedQuery } from '../common/pagination/paginated-query.dto';
import { InvoiceItemsResponseDto } from './dto/invoice-items-response.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateInvoiceItemsDto } from './dto/update-invoice-items.dto';
import { FileUpload as FileUpload } from '../common/decorators/file-upload.decorator';

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
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req) {
    return this.invoiceService.create(createInvoiceDto, req.user);
  }

  @ApiResponses({
    200: PaginatedResponse(InvoiceResponseDto),
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoices (paginated)' })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Invoice })
  async findAll(@Query() query: PaginatedQuery) {
    const [data, total] = await this.invoiceService.findAll(query);
    return {
      data: data.map((i) => new InvoiceResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: PaginatedResponse(InvoiceResponseDto),
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoices for brigadier (paginated)' })
  @Get('brigadier/:brigadierId')
  @CheckAbilities({ action: Action.Read, subject: Invoice }) //TODO add permissions check CASL
  async getForBrigadier(@Param('brigadierId') brigadierId: number, @Query() query: PaginatedQuery) {
    const [data, total] = await this.invoiceService.getForBrigadier(brigadierId, query);
    return {
      data: data.map((i) => new InvoiceResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    200: StreamableFile,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoice (.docx)' })
  @Get(':id/file')
  @CheckAbilities({ action: Action.Read, subject: Invoice })
  async getFile(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    const invoice = await this.invoiceService.getInvoice(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="request-${id}-report.docx`,
    });
    return new StreamableFile(invoice);
  }

  @ApiResponses({
    200: InvoiceItemsResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoice items' })
  @Get(':id/items')
  @CheckAbilities({ action: Action.Read, subject: Invoice })
  async getItems(@Param('id') id: number) {
    const invoiceItems = await this.invoiceService.getItems(id);
    return invoiceItems.map((i) => new InvoiceItemsResponseDto(i));
  }

  @ApiResponses({
    200: InvoiceResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get invoice' })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: Invoice })
  async get(@Param('id') id: number) {
    const invoice = await this.invoiceService.get(id);
    return new InvoiceResponseDto(invoice);
  }

  @ApiResponses({
    200: InvoiceResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Invoice })
  async remove(@Param('id') id: string) {
    return new InvoiceResponseDto(await this.invoiceService.remove(+id));
  }

  @ApiResponses({
    200: InvoiceResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id/update-status')
  @CheckAbilities({ action: Action.Update, subject: Invoice })
  async updateByStatus(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @Req() req) {
    return new InvoiceResponseDto(await this.invoiceService.updateByStatus(+id, updateInvoiceDto, req.user));
  }

  @ApiResponses({
    200: InvoiceResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Invoice })
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @Req() req) {
    return new InvoiceResponseDto(await this.invoiceService.update(+id, updateInvoiceDto, req.user));
  }

  @ApiResponses({
    200: InvoiceResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id/items')
  @CheckAbilities({ action: Action.Update, subject: Invoice })
  async updateItems(@Param('id') id: string, @Body() updateInvoiceItemsDto: UpdateInvoiceItemsDto, @Req() req) {
    return new InvoiceResponseDto(await this.invoiceService.updateItems(+id, updateInvoiceItemsDto, req.user));
  }

  @ApiResponses({
    200: MessageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id/upload-scan')
  @FileUpload()
  @CheckAbilities({ action: Action.Update, subject: Invoice })
  async uploadScan(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.invoiceService.uploadScan(+id, file);
  }

  @ApiResponses({
    200: MessageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id/upload-receipt')
  @FileUpload()
  @CheckAbilities({ action: Action.Update, subject: Invoice })
  async uploadReceipt(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return await this.invoiceService.uploadReceipt(+id, file, req.user);
  }
}
