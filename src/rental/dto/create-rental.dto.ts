import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsPositive, MinDate } from 'class-validator';

export class CreateRentalDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  toolId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  brigadierId: number;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
