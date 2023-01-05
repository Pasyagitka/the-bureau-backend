export class RequestAccessoryResponseDto {
  sku: string;
  name: string;
  quantity: number;

  constructor(partial: Partial<RequestAccessoryResponseDto>) {
    Object.assign(this, partial);
  }
}
