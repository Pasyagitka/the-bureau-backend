import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { RequestReportResponseDto } from './dto/request-report.response.dto';
import { RequestReportService } from './request-report.service';
import { Req, UploadedFiles } from '@nestjs/common/decorators';
import { FilesUpload } from '../common/decorators/files-upload.decorator';

@ApiAuth()
@ApiTags('Request Report')
@Controller('request-report/:requestId')
export class RequestReportController {
  constructor(private readonly requestReportService: RequestReportService) {}

  @ApiResponses({
    201: RequestReportResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @FilesUpload()
  @Post()
  //@CheckAbilities({ action: Action.Update, subject: Request })
  patch(@Param('requestId') requestId: number, @UploadedFiles() files: Array<Express.Multer.File>, @Req() req) {
    return this.requestReportService.patch(requestId, files, req.user);
  }

  @ApiResponses({
    200: [RequestReportResponseDto],
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get()
  //@CheckAbilities({ action: Action.Read, subject: Request })
  findAll(@Param('requestId') requestId: number, @Req() req) {
    return this.requestReportService.findAll(requestId, req.user);
  }
}
