import { registerAs } from '@nestjs/config';

const configToken = 'redis';
export default registerAs(configToken, () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
}));
