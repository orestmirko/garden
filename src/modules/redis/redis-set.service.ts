import { Injectable } from '@nestjs/common';
import { ChainableCommander } from 'ioredis';

import { AbstractRedisService } from '#modules/redis/abstract-redis.service';

/**
 * Class extends the `AbstractRedisService` to provide specialized functionalities for working with Redis sets.
 */
@Injectable()
export class RedisSetService extends AbstractRedisService {
  /**
   * Add a member to a Redis set.
   * @param {string} key - The Redis key associated with the set.
   * @param {string} value - The value to add to the set.
   * @param {ChainableCommander} [multi] - Optional transaction instance for executing this command within a transaction.
   */
  public addMember(key: string, value: string): Promise<number>;
  public addMember(key: string, value: string, multi: ChainableCommander): ChainableCommander;
  public addMember(key: string, value: string, multi?: ChainableCommander) {
    const client = multi || this.redisClient;
    return client.sadd(key, value);
  }

  /**
   * Removes a member from a Redis set
   * @param {string} key - The Redis key associated with the set.
   * @param {string} setMember - The member to remove from the set.
   * @param {ChainableCommander} [multi] - Optional transaction instance for executing this command within a transaction.
   */
  public delMember(key: string, setMember: string): Promise<number>;
  public delMember(key: string, setMember: string, multi?: ChainableCommander): ChainableCommander;
  public delMember(key: string, setMember: string, multi?: ChainableCommander) {
    const client = multi || this.redisClient;
    return client.srem(key, setMember);
  }

  /**
   * Get all members of a Redis set.
   * @param {string} key - The Redis key associated with the set.
   */
  public getMembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key);
  }
}
