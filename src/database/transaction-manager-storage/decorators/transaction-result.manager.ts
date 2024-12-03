import { Logger } from '@nestjs/common';
import EventEmitter from 'events';

import { LoggerContextEnum } from '#common/models/enums';

const COMMIT_EVENT_NAME = 'commit';
const ROLLBACK_EVENT_NAME = 'rollback';

export class TransactionResultManager {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  onCommit(callback: () => Promise<void>): void {
    this.emitter.once(COMMIT_EVENT_NAME, async () => {
      await callback().catch((error) => {
        Logger.log(`onCommit error: ${error.message}`, LoggerContextEnum.transactions);
      });
    });
  }

  onRollback(callback: () => Promise<void>): void {
    this.emitter.once(ROLLBACK_EVENT_NAME, async () => {
      await callback().catch((error) => {
        Logger.log(`onRollback error: ${error.message}`, LoggerContextEnum.transactions);
      });
    });
  }

  reportCommit(): void {
    this.emitter.emit(COMMIT_EVENT_NAME);
  }

  reportRollback(): void {
    this.emitter.emit(ROLLBACK_EVENT_NAME);
  }
}
