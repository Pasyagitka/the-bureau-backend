import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateStageDto {
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  mountingPrice: number;
}
