import { IsNumber } from 'class-validator';

export class LeaveBidDto {
  @IsNumber()
  requestId: number;

  @IsNumber()
  brigadierId: number;
}
