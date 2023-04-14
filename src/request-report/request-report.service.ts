/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from '../common/exceptions';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Request } from '../request/entities/request.entity';
import { RequestReport } from './entities/request-report.entity';
import { PatchRequestReportDto } from './dto/patch-request-report.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RequestReportService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestReport)
    private requestReportRepository: Repository<RequestReport>,
    private cloudinary: CloudinaryService,
    private dataSource: DataSource,
  ) {}

  async patch(requestId: number, files: Array<Express.Multer.File>) {
    return await this.dataSource.transaction(async (transaction) => {
      const request = await transaction.getRepository(Request).findOne({ where: { id: requestId } });
      if (!request) throw new NotExistsError('request');

      //const incomingReportFiles = patchRequestReportDto.map((i) => i.file);
      const incomingReportFiles = files;
      const existingReportFiles = (await transaction.getRepository(RequestReport).find({ where: { requestId } })).map(
        (i) => i.file,
      );

      await transaction.getRepository(RequestReport).delete({
        requestId,
        file: Not(In(incomingReportFiles)),
      });

      const filesToAdd = incomingReportFiles.filter((x) => !existingReportFiles.includes(x.toString()));

      const uploadedFilesResults = await Promise.all(
        files.map(
          async (file) =>
            await this.cloudinary.uploadImage(file).catch(() => {
              throw new BadRequestException('Invalid file type.');
            }),
        ),
      );

      const requestReportsToAdd = filesToAdd.map((x) =>
        transaction.getRepository(RequestReport).create({
          file: x.toString(),
          requestId: requestId,
        }),
      );

      console.log(uploadedFilesResults);

      return await transaction.getRepository(RequestReport).save(requestReportsToAdd);
    });
  }

  findAll(requestId: number) {
    return this.requestReportRepository.find({
      where: {
        request: {
          id: requestId,
        },
      },
    });
  }
}
