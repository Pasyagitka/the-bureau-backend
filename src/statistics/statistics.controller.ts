import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { LabelStatisticsResponseDto, StatisticsResponseDto } from './dto/statistics.response';
import { StatisticsQuery } from './dto/statistics.query.dto';
import { BrigadierTopListResponseDto } from './dto/brigadier-top-list.response.dto';

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
    200: [LabelStatisticsResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('request')
  async getRequestStatistics(@Query() query: StatisticsQuery) {
    const res = await this.statisticsService.getRequestCount(query);
    return res.map((i) => new LabelStatisticsResponseDto(i));
  }

  @ApiResponses({
    200: [LabelStatisticsResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('invoice')
  async getInvoiceStatistics(@Query() query: StatisticsQuery) {
    const res = await this.statisticsService.getInvoiceCount(query);
    return res.map((i) => new LabelStatisticsResponseDto(i));
  }

  @ApiResponses({
    200: [BrigadierTopListResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get('brigadier/top')
  async getRecommendedBrigadiers(@Query() query: StatisticsQuery) {
    return (await this.statisticsService.getBrigadiersTop(query)).map((i) => new BrigadierTopListResponseDto(i));
  }

  @ApiResponses({
    200: StatisticsResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get('equipment/installed')
  async getInstalledEquipmentCount(@Query() query: StatisticsQuery) {
    return new StatisticsResponseDto(await this.statisticsService.getEquipmentCount(query));
  }

  @ApiResponses({
    200: [LabelStatisticsResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get('accessories/sold')
  async getSoldAccessoriesStatistics(@Query() query: StatisticsQuery) {
    const res = await this.statisticsService.getSoldAccessoriesStatistics(query);
    return res.map((i) => new LabelStatisticsResponseDto(i));
  }
}
