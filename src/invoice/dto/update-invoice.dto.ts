import { IsEnum, IsOptional } from 'class-validator';
import { InvoiceStatus } from '../types/invoice-status.enum';

export class UpdateInvoiceDto {
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;
}
