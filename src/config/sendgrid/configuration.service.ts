import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import configuration from './configuration';

@Injectable()
export class SendgridConfigService {
  constructor(
    @Inject(configuration.KEY)
    private sendgridConfiguration: ConfigType<typeof configuration>,
  ) {}

  get apiKey(): string {
    return this.sendgridConfiguration.apiKey;
  }

  get senderEmail(): string {
    return this.sendgridConfiguration.senderEmail;
  }
}
