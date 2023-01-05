export class ClientResponseDto {
  id: number;
  firstname: string;
  surname: string;
  contactNumber: string;
  patronymic: string;

  constructor(partial: Partial<ClientResponseDto>) {
    Object.assign(this, partial);
  }
}
