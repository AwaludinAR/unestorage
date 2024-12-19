import { Provider } from "@nestjs/common";
import { NamespaceDefinition } from "./interfaces";
import { prefixStorage, Storage } from "unstorage";
import { getNamespaceToken, getStorageToken } from "./common";
import { UNESTORAGE_DEFAULT_NAMESPACE } from "./unestorage.constants";

export function createUnestorageProviders(
  storageName?: string,
  opts: NamespaceDefinition[] = []
): Provider[] {
  if (opts.length === 0) {
    opts.push({ name: UNESTORAGE_DEFAULT_NAMESPACE });
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
