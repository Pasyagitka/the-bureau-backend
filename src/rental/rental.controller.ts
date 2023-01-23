import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { MessageResponseDto } from '../common/dto/message-response.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';

@ApiAuth()
@ApiTags('Rental')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @ApiResponses({
    201: RentalResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Rental })
  openRental(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.open(createRentalDto);
  }

  @ApiResponses({
    200: [RentalResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: Rental })
  async findAll(@Query() query: RentalQueryDto) {
    return this.rentalService.findAll(query);
  }

  @ApiResponses({
    200: MessageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: Rental })
  approve(@Param('id') id: string) {
    return this.rentalService.approve(+id);
  }

  @ApiResponses({
    200: RentalResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: Rental })
  closeRental(@Param('id') id: string) {
    return this.rentalService.close(+id);
  }
}
