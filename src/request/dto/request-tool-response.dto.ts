export class RequestToolResponseDto {
  name: string;

  constructor(partial: Partial<RequestToolResponseDto>) {
    Object.assign(this, partial);
  }
}
