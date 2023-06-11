export class UserInfoResponseDto {
  id: number;
  role: string;
  client: {
    id?: number;
  };
  brigadier: {
    id?: number;
  };

  constructor(partial: Partial<UserInfoResponseDto>) {
    Object.assign(this, partial);
  }
}
