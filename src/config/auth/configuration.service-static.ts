import { ConfigurationServiceStatic } from '../configuration.service-static';

export class AuthConfigurationServiceStatic {
  static get accessTokenSecret() {
    return ConfigurationServiceStatic.get('AUTH_TOKEN_SECRET');
  }

  static get refreshTokenSecret() {
    return ConfigurationServiceStatic.get('AUTH_REFRESH_TOKEN_SECRET');
  }

  static get accessTokenExpiration() {
    return ConfigurationServiceStatic.get('AUTH_ACCESS_TOKEN_EXPIRATION');
  }

  static get refreshTokenExpiration() {
    return ConfigurationServiceStatic.get('AUTH_REFRESH_TOKEN_EXPIRATION');
  }
}
