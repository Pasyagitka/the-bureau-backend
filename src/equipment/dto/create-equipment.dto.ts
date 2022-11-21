import { IsString, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';
import { Mounting } from '../entities/equipment.entity';

export class CreateEquipmentDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  type: string;

  @IsEnum(Mounting) //TODO check case sensitive
  mounting: Mounting;
}
