import { IgnoreTransactionStorage } from '../storages';
import { ignoreTransaction } from '../utils';

export function IgnoreTransaction<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  M extends (...args: unknown[]) => Promise<unknown>,
>(): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function <M>(target: unknown, methodKey: symbol | string, descriptor) {
    if (!ignoreTransaction()) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args) {
        return IgnoreTransactionStorage.run(
          () => (originalMethod as () => unknown).apply(this, args),
          true,
        );
      };
    }
  };
}
