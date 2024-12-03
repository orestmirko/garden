import { registerAs } from '@nestjs/config';

const configToken = 'app';
export default registerAs(configToken, () => ({
  environment: process.env.ENVIRONMENT,
  port: process.env.APP_PORT,
  webServerHost: process.env.APP_WEB_SERVER_HOST,
  apiServerHost: process.env.APP_API_SERVER_HOST,
}));
