import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntity } from './entities/base.entity';
import { IBaseService } from './IBase.service';

export class BaseService<T extends BaseEntity> implements IBaseService<T> {
  constructor(private readonly genericRepository: Repository<T>) {}

  create(entity: any): Promise<T> {
    try {
      return new Promise<T>((resolve, reject) => {
        this.genericRepository
          .save(entity)
          .then((created) => resolve(created))
          .catch((err) => reject(err));
      });
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  getAll(): Promise<T[]> {
    try {
      return <Promise<T[]>>this.genericRepository.find();
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  get(id: number): Promise<T> {
    try {
    } catch (error) {
      throw new BadGatewayException(error);
    }
    return <Promise<T>>this.genericRepository.findOneById(id);
  }

  remove(id: number) {
    try {
      this.genericRepository.delete(id);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  update(id: number, entity: any): Promise<any> {
    try {
      return new Promise<T>((resolve, reject) => {
        this.genericRepository
          .findOneById(entity.id)
          .then((responseGet) => {
            try {
              if (responseGet == null) reject('Not existing'); //todo ??
              const retrievedEntity: any = responseGet as any;
              this.genericRepository
                .save(retrievedEntity)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
            } catch (e) {
              reject(e);
            }
          })
          .catch((err) => reject(err));
      });
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
