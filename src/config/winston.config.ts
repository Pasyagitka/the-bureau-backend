import { registerAs } from '@nestjs/config';
import winston from 'winston';

export default registerAs('winston', () => ({
  transports: [
    // new winston.transports.Console({
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.ms(),
    //     nestWinstonModuleUtilities.format.nestLike(process.env.API_NAME, {
    //       prettyPrint: true,
    //     }),
    //   ),
    // }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
}));
