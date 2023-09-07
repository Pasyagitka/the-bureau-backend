import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../common/decorators/auth.decorator';
import { Action } from '../../ability/types';
import { Request } from '../entities/request.entity';
import { ApiResponses } from 'src/common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from 'src/common/dto/error-message-response.dto';
import { PaginatedResponse } from 'src/common/pagination/paginate.dto';
import { RequestBidResponseDto } from '../dto/bids/request-bid.response.dto';
import { RequestBidService } from '../services/request-bid.service';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { LeaveBidDto } from '../dto/bids/leave-bid.dto';

@ApiAuth()
@ApiTags('Request Bids')
@Controller('request/:requestId/bids')
export class RequestBidController {
  constructor(private readonly requestBidService: RequestBidService) {}

  @ApiResponses({
    200: PaginatedResponse(RequestBidResponseDto),
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiOperation({ summary: 'Get all bids from brigadiers to this request' })
  @Get()
  async getRequestBids(@Param('requestId') id: number) {
    const [bids, total] = await this.requestBidService.getRequestBids(id);
    return {
      data: bids.map((i) => new RequestBidResponseDto(i)),
      total,
    };
  }

  @ApiResponses({
    201: RequestBidResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Post()
  @CheckAbilities({ action: Action.Create, subject: Request })
  async create(@Body() leaveBidDto: LeaveBidDto) {
    const { requestId, brigadierId } = leaveBidDto;
    await this.requestBidService.leaveBid(requestId, brigadierId);
    const bid = await this.requestBidService.getBid(requestId, brigadierId);
    return new RequestBidResponseDto(bid);
  }
}
