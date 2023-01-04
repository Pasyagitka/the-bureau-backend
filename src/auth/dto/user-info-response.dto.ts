export class UserInfoResponseDto {
  id: number;
  role: string; //todo enum
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
