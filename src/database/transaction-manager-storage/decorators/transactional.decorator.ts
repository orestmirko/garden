import { dataSourceRef } from '../helpers';
import { TransactionManagerStorage } from '../storages';
import { getEntityManager } from '../utils';
import { TransactionResultManager } from './transaction-result.manager';

export function Transactional<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  M extends (...args: unknown[]) => Promise<unknown>,
>(): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function <M>(target: unknown, methodKey: symbol | string, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const hasTransactionalContext = !!getEntityManager();
      if (!hasTransactionalContext) {
        const transactionResultManager = new TransactionResultManager();
        try {
          const result = await dataSourceRef.transaction(async (entityManager) => {
            return TransactionManagerStorage.run(
              () => (originalMethod as () => unknown).apply(this, args),
              { entityManager, transactionResultManager },
            );
          });
          transactionResultManager.reportCommit();
          return result;
        } catch (error) {
          transactionResultManager.reportRollback();
          throw error;
        }
      } else {
        return originalMethod.apply(this, args);
      }
    };
  };
}
