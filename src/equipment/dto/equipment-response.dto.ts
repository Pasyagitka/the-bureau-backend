export class EquipmentResponseDto {
  id: number;
  type: string;
  mounting: string;

  constructor(partial: Partial<EquipmentResponseDto>) {
    Object.assign(this, partial);
  }
}
