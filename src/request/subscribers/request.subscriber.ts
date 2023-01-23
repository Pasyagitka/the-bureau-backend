import { Injectable } from '@nestjs/common';
import { Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { ScheduleService } from '../../schedule/schedule.service';
import { Request } from '../entities/request.entity';

@Injectable()
@EventSubscriber()
export class RequestSubscriber implements EntitySubscriberInterface<Request> {
  constructor(private readonly connection: Connection, private readonly scheduleService: ScheduleService) {
    connection.subscribers.push(this);
  }

  listenTo(): any {
    return Request;
  }

  async afterUpdate(event: UpdateEvent<Request>): Promise<Promise<any> | void> {
    const brigadierGotUpdated = event.updatedRelations.find((value) => value.propertyName, Request.prototype.brigadier);
    if (brigadierGotUpdated) {
      if (event.entity?.brigadier?.id) {
        await this.scheduleService.addRecord({
          request: event.entity.id,
          brigadier: event.entity.brigadier.id,
        });
      }
    }
  }
}
