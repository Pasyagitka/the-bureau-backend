import { Stage } from '../entities/stage.entity';

export class CreateRequestDto {
  registerDate: Date;
  clientDateStart: Date;
  mountingDate: string | null;
  clientDateEnd: Date;
  comment: string | null;
  stage: Stage;
  clientId: number;
  address: {
    country: string;
    city: string;
    house: number;
    corpus: string | null;
    flat: number | null;
  };
  requestEquipment: RequestEquipment[];
}

class RequestEquipment {
  quantity: number;
  equipment: number;
}
