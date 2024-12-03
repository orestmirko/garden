import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthConfigService } from '#config/auth/configuration.service';
import { UnauthorizedCustomException } from '#modules/auth/exceptions';
import { TokenResponseDto } from '#modules/auth/models/dtos/response';
import { TokenType } from '#modules/auth/models/enums';
import { IAuthTokens, JwtPayload } from '#modules/auth/models/interfaces';
import { TokenStorageService } from '#modules/auth/services/token-storage.service';

/**
 * Class provides functionalities for generating, validating, and managing authentication tokens.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AuthConfigService,
    private readonly tokenStorageService: TokenStorageService,
  ) {}

  /**
   * Generates a new set of authentication tokens (access and refresh) based on the provided JWT payload.
   * @param {JwtPayload} payload - The JWT payload.
   * @returns {TokenResponseDto} Generated tokens along with their expiration times.
   */
  public generateAuthTokens(payload: JwtPayload): TokenResponseDto {
    const accessTokenSecret = this.configService.accessTokenSecret;
    const accessTokenExpires = this.configService.accessTokenExpiration;
    const refreshTokenSecret = this.configService.accessTokenSecret;
    const refreshTokenExpires = this.configService.refreshTokenExpiration;

    const accessToken = this.generateToken(payload, accessTokenSecret, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenSecret, refreshTokenExpires);

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  /**
   * Validates a given token against the stored token for a specific user and device, throwing an error if it does not match.
   * @param {JwtPayload} payload - The payload containing the user's and device's identifiers.
   * @param {string} token - The token to validate.
   * @param {TokenType} type - The type of the token (access or refresh) being validated.
   * @returns A promise that resolves if the token is valid or rejects with an UnauthorizedCustomException if not.
   * @throws {UnauthorizedCustomException} If the provided token does not match the stored token for the user and device.
   */
  async validate(payload: JwtPayload, token: string, type: TokenType): Promise<void> {
    const savedPair = await this.tokenStorageService.getPair(payload.userId, payload.deviceId);
    const savedToken = this.getTokenByType(savedPair, type);
    if (savedToken !== token) {
      throw new UnauthorizedCustomException();
    }
  }

  /**
   * Retrieves a token of a specified type (access or refresh) from the given token pair.
   * @param {IAuthTokens} tokens - The pair of tokens from which to retrieve the specified type.
   * @param {TokenType} type - The type of the token to retrieve.
   * @returns Requested token.
   */
  public getTokenByType(tokens: IAuthTokens, type: TokenType): string {
    switch (type) {
      case TokenType.ACCESS:
        return tokens.accessToken;
      case TokenType.REFRESH:
        return tokens.refreshToken;
    }
  }

  /**
   * Generates a token based on the given payload, secret, and expiration time.
   * @param {JwtPayload} payload - The payload for the token.
   * @param {string} secret - The secret key used to sign the token.
   * @param {string} expiresIn - The expiration time of the token.
   * @returns Generated token.
   */
  private generateToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn, secret });
  }
}
