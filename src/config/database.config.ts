import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    url: process.env.DB_URL,
    // ssl: {
    //   ca: 'D\\:ProjectsTheBureau\\the-bureau-backend\\cert\\ca-certificate.crt',
    // },
    // host: process.env.DB_HOST,
    // port: parseInt(process.env.DB_PORT) || 5432,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    synchronize: true,
    //logging: true,
    // entities: [
    //   Accessory,
    //   Address,
    //   Brigadier,
    //   BrigadierTool,
    //   Equipment,
    //   Client,
    //   Stage,
    //   Tool,
    //   Request,
    //   RequestEquipment,
    //   RequestReport,
    //   Schedule,
    //   User,
    // ],
    autoLoadEntities: true,
  };
});
