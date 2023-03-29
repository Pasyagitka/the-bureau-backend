import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, ArrayMinSize, ValidateNested, IsNumber, IsPositive } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @Type(() => AccessoryInvoiceItemDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items: AccessoryInvoiceItemDto[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  customerId: number;
}

class AccessoryInvoiceItemDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  accessoryId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
