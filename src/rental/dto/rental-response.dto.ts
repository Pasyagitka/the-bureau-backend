import { Exclude, Expose, Type } from 'class-transformer';
import { BrigadierResponseDto } from '../../brigadier/dto/brigadier-response.dto';
import { ToolResponseDto } from '../../tool/dto/tool-response.dto';

@Exclude()
export class RentalResponseDto {
  @Expose()
  id: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  @Type(() => BrigadierResponseDto)
  brigadier: BrigadierResponseDto;

  @Expose()
  @Type(() => ToolResponseDto)
  tool: ToolResponseDto;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  isApproved: boolean;

  constructor(partial: Partial<RentalResponseDto>) {
    Object.assign(this, partial);
  }
}
