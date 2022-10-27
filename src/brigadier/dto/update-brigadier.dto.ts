import { PartialType } from '@nestjs/mapped-types';
import { CreateBrigadierDto } from './create-brigadier.dto';

export class UpdateBrigadierDto extends PartialType(CreateBrigadierDto) {}
