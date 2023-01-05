export class ClientRequestResponseDto {
  id: number;
  registerDate: string;
  mountingDate: string;
  comment: string;
  status: string;

  client: {
    id: number;
    firstname: string;
    surname: string;
    patronymic: string;
    contactNumber: string;
  };

  stage: {
    id: number;
    stage: string;
  };

  address: {
    id: number;
    country: string;
    city: string;
    street: string;
    house: number;
    corpus: string;
    flat: string;
  };

  brigadier: {
    id: number;
    firstname: string;
    surname: string;
    patronymic: string;
    contactNumber: string;
    user: {
      id: number;
      login: string;
      email: string;
      password: string; //exclude
      role: string;
    };
  };

  requestEquipment: Array<RequestEquipmentResponseDto>;

  constructor(partial: Partial<ClientRequestResponseDto>) {
    Object.assign(this, partial);
  }
}

class RequestEquipmentResponseDto {
  id: number;
  quantity: number;
  equipment: {
    id: number;
    type: string;
    mounting: string;
  };
}
