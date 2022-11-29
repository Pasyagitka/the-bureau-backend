import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateRequestBrigadierDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  brigadier: number;
}
