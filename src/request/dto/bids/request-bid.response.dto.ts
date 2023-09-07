import { Exclude, Expose, Transform } from 'class-transformer';
import { Brigadier } from '../../../brigadier/entities/brigadier.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Exclude()
export class RequestBidResponseDto {
  @Expose()
  brigadierId: number;

  @Expose()
  requestId: number;

  @Expose()
  createdAt: Date;

  @Expose({ name: 'brigadierFullName' })
  @ApiPropertyOptional({ type: 'string', name: 'brigadierFullName' })
  @Transform(({ value }) => value && `${value.surname} ${value.firstname} ${value.patronymic}`)
  brigadier?: Brigadier;

  constructor(partial: Partial<RequestBidResponseDto>) {
    Object.assign(this, partial);
  }
}
