import { IsString, IsPositive, MaxLength, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateToolDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stageId: number;
}
