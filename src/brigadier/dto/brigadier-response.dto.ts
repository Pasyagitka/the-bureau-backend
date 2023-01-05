export class BrigadierResponseDto {
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

  constructor(partial: Partial<BrigadierResponseDto>) {
    Object.assign(this, partial);
  }
}
