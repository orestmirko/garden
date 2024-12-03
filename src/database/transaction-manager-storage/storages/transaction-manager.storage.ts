import { EntityManager } from 'typeorm';

import { AsyncStorageFactory } from '#common/factories';

import { TransactionResultManager } from '../decorators/transaction-result.manager';

interface TransactionStorageItem {
  entityManager?: EntityManager;
  transactionResultManager?: TransactionResultManager;
}

export class TransactionManagerStorage extends AsyncStorageFactory<TransactionStorageItem>() {}
