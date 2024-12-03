import { DataSource, EntityManager, Repository } from 'typeorm';

import { TypeOrmUpdatedPatchError } from './typeorm-updated-patch';
import { getEntityManager, ignoreTransaction } from './utils';

const REPOSITORY_MANAGER_KEY = 'transaction-storage:original-manager';

export let dataSourceRef: DataSource;
let wasRepositoryPatched = false;

const getEntityManagerIfNotIgnored = () => (ignoreTransaction() ? null : getEntityManager());

export const addTransactionalDataSource = (dataSource: DataSource) => {
  dataSourceRef = dataSource;
  let originalManager = dataSource.manager;

  // Patch datasource manager
  Object.defineProperty(dataSource, 'manager', {
    get() {
      return getEntityManagerIfNotIgnored() || originalManager;
    },
    set(manager: EntityManager) {
      originalManager = manager;
    },
  });

  // Patch repository (only once)
  if (!wasRepositoryPatched) {
    Object.defineProperty(Repository.prototype, 'manager', {
      get() {
        return getEntityManagerIfNotIgnored() || Reflect.getMetadata(REPOSITORY_MANAGER_KEY, this);
      },
      set(manager: EntityManager) {
        Reflect.defineMetadata(REPOSITORY_MANAGER_KEY, manager, this);
      },
    });
    wasRepositoryPatched = true;
  }

  // Patch DataSource.query
  const originalQuery = DataSource.prototype.query;
  if (originalQuery.length !== 3) {
    throw new TypeOrmUpdatedPatchError();
  }

  dataSource.query = function (...args: unknown[]) {
    args[2] = args[2] || this.manager?.queryRunner;

    return originalQuery.apply(this, args);
  };

  // Patch DataSource.createQueryBuilder
  const originalCreateQueryBuilder = DataSource.prototype.createQueryBuilder;
  if (originalCreateQueryBuilder.length !== 3) {
    throw new TypeOrmUpdatedPatchError();
  }

  dataSource.createQueryBuilder = function (...args: unknown[]) {
    if (args.length === 0) {
      return originalCreateQueryBuilder.apply(this, [this.manager?.queryRunner]);
    }

    args[2] = args[2] || this.manager?.queryRunner;

    return originalCreateQueryBuilder.apply(this, args);
  };

  // Preserve original entity manager for new manual transaction creating
  dataSource.transaction = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return originalManager.transaction(...args);
  };

  return dataSource;
};

// Code based on the https://github.com/Aliheym/typeorm-transactional/blob/master/src/common/index.ts
