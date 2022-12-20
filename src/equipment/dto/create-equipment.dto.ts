import { IsString, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';
import { Mounting } from '../types/mounting.enum';

export class CreateEquipmentDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  type: string;

  @IsEnum(Mounting)
  mounting: Mounting;
}
