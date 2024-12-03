import { registerAs } from '@nestjs/config';

const configToken = 'sendpulse';
export default registerAs(configToken, () => ({
  apiKey: process.env.SENDPULSE_API_KEY,
  apiSecret: process.env.SENDPULSE_API_SECRET,
})); 