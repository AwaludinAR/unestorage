import { Provider } from "@nestjs/common";
import { NamespaceDefinition } from "./interfaces";
import { prefixStorage, Storage } from "unstorage";
import { getNamespaceToken, getStorageToken } from "./common";

export function createUnestorageProviders(
  storageName?: string,
  opts: NamespaceDefinition[] = []
): Provider[] {
  if (opts.length === 0) {
    return [
      {
        provide: getNamespaceToken(),
        useFactory: (storage: Storage) => storage,
        inject: [getStorageToken(storageName)],
      },
    ];
  }

  return opts.reduce(
    (providers, option) => [
      ...providers,
      {
        provide: getNamespaceToken(option.name, storageName),
        useFactory: (storage: Storage) => {
          if (!option.base) {
            return storage;
          }

          return prefixStorage(storage, option.base);
        },
        inject: [getStorageToken(storageName)],
      },
    ],
    [] as Provider[]
  );
}
