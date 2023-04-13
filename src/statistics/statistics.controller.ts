import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { StatisticsResponseDto } from './dto/statistics.response';

@Controller('statistics')
@ApiAuth()
@ApiTags('Statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  //getBrigadiers (top) with max approved requests count
  @ApiResponses({
    200: StatisticsResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('brigadier')
  async getBrigadierStatistics() {
    return new StatisticsResponseDto({ count: await this.statisticsService.getBrigadiersCount() });
  }

  @ApiResponses({
    200: StatisticsResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('client')
  async getClientStatistics() {
    return new StatisticsResponseDto({ count: await this.statisticsService.getClientsCount() });
  }

  @ApiResponses({
    200: [StatisticsResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('request')
  async getRequestStatistics() {
    return (await this.statisticsService.getRequestStatistics()).map((i) => new StatisticsResponseDto({ count: i }));
  }
}
