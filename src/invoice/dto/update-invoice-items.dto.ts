import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { AccessoryInvoiceItemDto } from './create-invoice.dto';

export class UpdateInvoiceItemsDto {
  @IsNotEmpty()
  @Type(() => AccessoryInvoiceItemDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items: AccessoryInvoiceItemDto[];
}
