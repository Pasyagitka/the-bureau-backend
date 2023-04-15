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
      const existingReportFiles = await (
        await transaction.getRepository(RequestReport).find({ where: { requestId } })
      ).map((x) => x.public_id);

      //const filesToAdd = incomingReportFiles.filter((x) => !existingReportFiles.includes(x.toString()));

      const uploadedFilesResults = await Promise.all(
        incomingReportFiles.map(
          async (file) =>
            await this.cloudinary
              .uploadImage(file, {
                folder: `reports/${requestId}`,
                overwrite: false,
                resource_type: 'image',
                public_id: file.originalname,
              })
              .catch(() => {
                throw new BadRequestException('Invalid file type.');
              }),
        ),
      );

      const requestReportsToAdd = uploadedFilesResults
        .filter((x) => !existingReportFiles.includes(x.public_id))
        .map((x) =>
          transaction.getRepository(RequestReport).create({
            url: x.secure_url,
            requestId: requestId,
            public_id: x.public_id,
          }),
        );

      await transaction.getRepository(RequestReport).save(requestReportsToAdd);

      const filesToRemove = await transaction.getRepository(RequestReport).find({
        where: {
          requestId,
          public_id: Not(In(uploadedFilesResults.map((x) => x.public_id))),
        },
      });
      const removedFiles = await Promise.all(
        filesToRemove.map(
          async (file) =>
            await this.cloudinary.removeImage(file.public_id).catch(() => {
              throw new BadRequestException('Invalid file type.');
            }),
        ),
      );
      await transaction.remove(filesToRemove);
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
