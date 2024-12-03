import { AsyncLocalStorage } from 'async_hooks';

export function AsyncStorageFactory<D>() {
  return class BaseAsyncStorage {
    private static storage = new AsyncLocalStorage();

    public static run<R, T extends () => R>(callback: T, store: D): R {
      return BaseAsyncStorage.storage.run(store, callback);
    }

    public static get(): D {
      return BaseAsyncStorage.storage.getStore() as D;
    }
  };
}
