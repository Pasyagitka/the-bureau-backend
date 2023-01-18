import { PartialType } from '@nestjs/swagger';
import { CreateBrigadierDto } from './create-brigadier.dto';

export class UpdateBrigadierDto extends PartialType(CreateBrigadierDto) {}
