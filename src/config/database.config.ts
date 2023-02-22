import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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
    //   Rental,
    //   RequestReport,
    //   Schedule,
    //   User,
    // ],
    autoLoadEntities: true,
  };
});
