export class AccessoryResponseDto {
  id: number;
  sku?: string;

  equipment: {
    id: number;
    type: string;
    mounting: string;
  };

  constructor(partial: Partial<AccessoryResponseDto>) {
    Object.assign(this, partial);
  }
}
