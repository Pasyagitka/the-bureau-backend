import { registerAs } from '@nestjs/config';
import * as winston from 'winston';

export default registerAs('winston', () => ({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
}));
