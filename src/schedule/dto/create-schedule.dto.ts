import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  request: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  brigadier: number;
}
