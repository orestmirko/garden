import * as dotenv from 'dotenv';

/**
 * Class provides a convenient interface for accessing environment variables and configuration settings.
 * It allows for a fallback mechanism where if a variable is not defined in `process.env`, it can be retrieved from a provided object.
 */
export class ConfigurationService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public get(key: string): string {
    return process.env[key] || this.env[key];
  }
}

const environment = process.env.ENVIRONMENT ?? 'local';
dotenv.config({ path: `environments/${environment}.env` });
const ConfigurationServiceStatic = new ConfigurationService(process.env);
export { ConfigurationServiceStatic };
