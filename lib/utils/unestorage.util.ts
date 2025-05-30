import { Provider, Type } from '@nestjs/common';
import { prefixStorage } from 'unstorage';
import { UNESTORAGE_STORAGE_NAME } from '../unestorage.constants';
import {
  NamespaceDefinition,
  UnestorageModuleAsyncOptions,
  UnestorageOptionsFactory,
} from '../unestorage.interface';

export function getStorageToken(storageName?: string) {
  return storageName && storageName !== UNESTORAGE_STORAGE_NAME
    ? `${UNESTORAGE_STORAGE_NAME}${storageName}`
    : UNESTORAGE_STORAGE_NAME;
}

export function getNamespaceToken(namespace: string, storageName?: string) {
  return `${getStorageToken(storageName)}${namespace}`;
}

export function createNamespaceProvider(
  namespace: NamespaceDefinition,
  storageName?: string,
): Provider {
  const storageToken = getStorageToken(storageName);
  return {
    provide: `${storageToken}${namespace.name}`,
    useFactory: (storage) => prefixStorage(storage, namespace.base),
    inject: [storageToken],
  };
}

export function createAsyncProviders(options: UnestorageModuleAsyncOptions) {
  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options)];
  }

  const useClass = options.useClass as Type<UnestorageOptionsFactory>;
  return [
    createAsyncOptionsProvider(options),
    {
      provide: useClass,
      useClass,
    },
  ];
}

export function createAsyncOptionsProvider(
  options: UnestorageModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: getStorageToken(options.storageName),
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: getStorageToken(options.storageName),
    useFactory: async (optsFactory: UnestorageOptionsFactory) =>
      optsFactory.createUnestorageOptions(),
    inject: [
      (options.useExisting ||
        options.useClass) as Type<UnestorageOptionsFactory>,
    ],
  };
}
