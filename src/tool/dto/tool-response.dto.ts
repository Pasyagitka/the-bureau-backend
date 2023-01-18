import { StageResponseDto } from './../../request/dto/brigadier-request-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ToolResponseDto {
  @Expose()
  name: string;

  @Expose()
  @Type(() => StageResponseDto)
  stage: StageResponseDto;

  constructor(partial: Partial<ToolResponseDto>) {
    Object.assign(this, partial);
  }
}
