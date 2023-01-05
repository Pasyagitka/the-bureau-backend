export class RequestResponseDto {
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

    user: {
      id: number;
      login: string;
      email: string;
      //password
      role: string;
    };
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

  stage: {
    id: number;
    stage: string;
  };

  constructor(partial: Partial<RequestResponseDto>) {
    Object.assign(this, partial);
  }
}
