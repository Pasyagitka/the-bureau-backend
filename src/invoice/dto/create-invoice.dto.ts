import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, ArrayMinSize, ValidateNested, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @Type(() => AccessoryInvoiceItemDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items: AccessoryInvoiceItemDto[];

  @IsNumber()
  @IsOptional()
  customerId?: number;
}

export class AccessoryInvoiceItemDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  accessoryId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
