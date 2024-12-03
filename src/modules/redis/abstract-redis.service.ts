import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ChainableCommander, Redis } from 'ioredis';

import { REDIS_CLIENT } from '#modules/redis/models/constants';

/**
 * Class provides a base implementation for Redis operations,
 */
@Injectable()
export class AbstractRedisService implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT)
    protected readonly redisClient: Redis,
  ) {}

  /**
   * Handles application shutdown events by safely closing the Redis client connection.
   */
  public onApplicationShutdown(): Promise<string> {
    return this.redisClient.quit();
  }

  /**
   * Creates a new Redis transaction (multi command).
   * @returns Transaction instance allowing the chaining of multiple commands to be executed atomically.
   */
  public multi(): ChainableCommander {
    return this.redisClient.multi();
  }

  /**
   * Executes a transaction, running all queued commands in sequence.
   * @param {ChainableCommander} multi - The transaction instance containing the queued commands.
   * @returns A promise that resolves once the transaction is completed.
   */
  public async exec(multi: ChainableCommander): Promise<void> {
    await multi.exec();
  }

  /**
   * Sets an expiration time on a given key. After the specified time, the key will be automatically deleted (in seconds).
   * @param {string} key - The key to set the expiration time on.
   * @param {number} time - The expiration time in seconds.
   * @param {ChainableCommander} multi - Optional transaction instance for executing this command within a transaction.
   */
  public expire(key: string, time: number): Promise<number>;
  public expire(key: string, time: number, multi: ChainableCommander): ChainableCommander;
  public expire(key: string, time: number, multi?: ChainableCommander) {
    const client = multi || this.redisClient;
    return client.expire(key, time);
  }
}
