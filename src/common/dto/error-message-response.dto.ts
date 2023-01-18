import { MessageResponseDto } from './message-response.dto';

export class ErrorMessageResponseDto extends MessageResponseDto {
  statusCode: number;
}
