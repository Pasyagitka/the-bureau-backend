import { Injectable } from '@nestjs/common';

@Injectable()
export class StageService {
  findAll() {
    return `This action returns all stage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stage`;
  }
}
