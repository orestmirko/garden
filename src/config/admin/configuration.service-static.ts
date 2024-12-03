import { ConfigurationServiceStatic } from '../configuration.service-static';

export class AdminConfigurationServiceStatic {
  static get email() {
    return ConfigurationServiceStatic.get('SUPER_ADMIN_EMAIL');
  }

  static get password() {
    return ConfigurationServiceStatic.get('SUPER_ADMIN_PASSWORD');
  }
}
