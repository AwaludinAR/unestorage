import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createStorage } from 'unstorage';
import {
  UnestorageModuleAsyncOptions,
  UnestorageModuleFactoryOptions,
  UnestorageModuleOptions,
} from './unestorage.interface';
import {
  createAsyncProviders,
  createNamespaceProvider,
  getStorageToken,
} from './utils';

@Module({})
export class UnestorageModule {
  static register(options?: UnestorageModuleOptions): DynamicModule {
    const { storageName, global, ...opts } = options || {};
    const storageToken = getStorageToken(storageName);
    const storageProvider: Provider = {
      provide: storageToken,
      useValue: createStorage(opts),
    };
    const namespaceProviders =
      options?.namespaces?.map((namespace) =>
        createNamespaceProvider(namespace, options.storageName),
      ) || [];
    return {
      global,
      module: UnestorageModule,
      providers: [storageProvider, ...namespaceProviders],
      exports: [storageProvider, ...namespaceProviders],
    };
  }

  static registerAsync(options: UnestorageModuleAsyncOptions): DynamicModule {
    const storageToken = getStorageToken(options.storageName);
    const storageProvider: Provider = {
      provide: storageToken,
      useFactory: (opts: UnestorageModuleFactoryOptions) => createStorage(opts),
    };
    const namespaceProviders =
      options.namespaces?.map((namespace) =>
        createNamespaceProvider(namespace, options.storageName),
      ) || [];
    const asyncProviders = createAsyncProviders(options);
    return {
      global: options.global,
      module: UnestorageModule,
      imports: options.imports,
      providers: [...asyncProviders, storageProvider, ...namespaceProviders],
      exports: [storageProvider, ...namespaceProviders],
    };
  }
}
