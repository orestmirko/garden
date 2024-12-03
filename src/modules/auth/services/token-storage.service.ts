import { Injectable } from '@nestjs/common';

import { TimeHelper } from '#common/helpers';
import { UserID } from '#entities/types';
import { AUTH_CACHE } from '#modules/auth/constants';
import { UnauthorizedCustomException } from '#modules/auth/exceptions';
import { TokenResponseDto } from '#modules/auth/models/dtos/response';
import { IAuthTokens } from '#modules/auth/models/interfaces';
import { RedisSetService } from '#modules/redis/redis-set.service';

/**
 * Class provides functionalities for managing authentication tokens in Redis.
 */
@Injectable()
export class TokenStorageService {
  constructor(private readonly redisSetService: RedisSetService) {}

  /**
   * Inserts a new set of authentication tokens for a given user and device.
   * If a token pair already exists for the device, it will be replaced.
   * @param {UserID} userId - The user's unique identifier.
   * @param {string} deviceId - The device's unique identifier.
   * @param {TokenResponseDto} tokens - The authentication tokens to be stored.
   * @returns A promise that resolves when the operation is complete.
   */
  public async insert(userId: UserID, deviceId: string, tokens: TokenResponseDto): Promise<void> {
    const transaction = this.redisSetService.multi();
    const key = this.getKey(userId);
    const setMember = await this.getRecordByDeviceId(key, deviceId);
    this.redisSetService.delMember(key, setMember, transaction);
    const pairToSave: IAuthTokens = {
      deviceId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    this.redisSetService.addMember(key, JSON.stringify(pairToSave), transaction);
    const expiration = TimeHelper.getDurationFromString(tokens.refreshTokenExpires);
    this.redisSetService.expire(key, expiration, transaction);
    await this.redisSetService.exec(transaction);
  }

  /**
   * Retrieves the authentication token pair for a given user and device.
   * @param {UserID} userId - The user's unique identifier.
   * @param {string} deviceId - The device's unique identifier.
   * @returns A promise that resolves with the authentication token pair.
   */
  public async getPair(userId: UserID, deviceId: string): Promise<IAuthTokens> {
    const key = this.getKey(userId);
    const setMember = await this.getRecordByDeviceId(key, deviceId);
    return JSON.parse(setMember);
  }

  /**
   * Invalidates the authentication token pair for a given user and device, effectively logging out the session.
   * @param {UserID} userId - The user's unique identifier.
   * @param {string} deviceId - The device's unique identifier.
   * @returns A promise that resolves when the token pair is invalidated.
   */
  public async invalidate(userId: UserID, deviceId: string): Promise<void> {
    const key = this.getKey(userId);
    const setMember = await this.getRecordByDeviceId(key, deviceId);
    await this.redisSetService.delMember(key, setMember);
  }

  /**
   * Constructs the Redis key for storing the token pairs, based on the user's ID.
   * @param {UserID} userId - The user's unique identifier.
   * @returns The Redis key.
   */
  private getKey(userId: UserID): string {
    return `${AUTH_CACHE.TOKENS}:${userId}`;
  }

  /**
   * Retrieves a record from Redis by the device ID within a set identified by the key.
   * @param {string} key - The Redis key where the set is stored.
   * @param {string} deviceId - The device's unique identifier.
   * @returns A promise that resolves with the set member matching the device ID.
   * @throws {UnauthorizedCustomException} If no token pair is found for the given user and device.
   */
  private async getRecordByDeviceId(key: string, deviceId: string): Promise<string> {
    const set = await this.redisSetService.getMembers(key);
    const setMember = set.find((item) => JSON.parse(item).deviceId === deviceId);
    if (!setMember) {
      throw new UnauthorizedCustomException();
    }
    return setMember;
  }
}
