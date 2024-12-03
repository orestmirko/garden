import { registerAs } from '@nestjs/config';

const configToken = 'sendgrid';
export default registerAs(configToken, () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  senderEmail: process.env.SENDGRID_SENDER_EMAIL,
}));
