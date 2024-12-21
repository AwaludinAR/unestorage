import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import {
  UnestorageModuleAsyncOptions,
  UnestorageModuleFactoryOptions,
  UnestorageModuleOptions,
  UnestorageOptionsFactory,
} from "./interfaces";
import { createStorage, CreateStorageOptions } from "unstorage";
import { getStorageToken } from "./common";
import {
  UNESTORAGE_MODULE_OPTIONS,
  UNESTORAGE_STORAGE_NAME,
} from "./unestorage.constants";

@Global()
@Module({})
export class UnestorageCoreModule {
  public static forRoot(opts: UnestorageModuleOptions): DynamicModule {
    const { driver, storageFactory, storageName } = opts;

    const unestorageStorageFactory = storageFactory || ((storage) => storage);
    const unestorageStorageName = getStorageToken(storageName);
    const unestorageStorageNameProvider: Provider = {
      provide: UNESTORAGE_STORAGE_NAME,
      useValue: unestorageStorageName,
    };

    const unestorageProvider: Provider = {
      provide: unestorageStorageName,
      useFactory: () => {
        return unestorageStorageFactory(
          UnestorageCoreModule.createStorage({ driver: driver }),
          unestorageStorageName
        );
      },
    };
    return {
      module: UnestorageCoreModule,
      providers: [unestorageProvider, unestorageStorageNameProvider],
      exports: [unestorageProvider],
    };
  }

  public static forRootAsync(
    opts: UnestorageModuleAsyncOptions
  ): DynamicModule {
    const unestorageStorageName = getStorageToken(opts.storageName);
    const unestorageStorageNameProvider: Provider = {
      provide: UNESTORAGE_STORAGE_NAME,
      useValue: unestorageStorageName,
    };

    const storageProvider = {
      provide: unestorageStorageName,
      useFactory: async (factoryOpts: UnestorageModuleFactoryOptions) => {
        const unestorageStorageFactory =
          factoryOpts.storageFactory || ((storage) => storage);
        return unestorageStorageFactory(
          UnestorageCoreModule.createStorage(factoryOpts),
          unestorageStorageName
        );
      },
      inject: [UNESTORAGE_MODULE_OPTIONS],
    };

    const asyncProviders = UnestorageCoreModule.createAsyncProviders(opts);
    return {
      module: UnestorageCoreModule,
      imports: opts.imports,
      providers: [
        ...asyncProviders,
        storageProvider,
        unestorageStorageNameProvider,
      ],
      exports: [storageProvider],
    };
  }

  private static createAsyncProviders(
    opts: UnestorageModuleAsyncOptions
  ): Provider[] {
    if (opts.useExisting || opts.useFactory) {
      return [this.createAsyncOptionsProvider(opts)];
    }
    const useClass = opts.useClass as Type<UnestorageOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(opts),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    opts: UnestorageModuleAsyncOptions
  ): Provider {
    if (opts.useFactory) {
      return {
        provide: UNESTORAGE_MODULE_OPTIONS,
        useFactory: opts.useFactory,
        inject: opts.inject || [],
      };
    }

    return {
      provide: UNESTORAGE_MODULE_OPTIONS,
      useFactory(optsFactory: UnestorageOptionsFactory) {
        return optsFactory.createUnestorageOptions();
      },
      inject: [
        (opts.useClass || opts.useExisting) as Type<UnestorageOptionsFactory>,
      ],
    };
  }

  private static createStorage(options: CreateStorageOptions) {
    return createStorage(options);
  }
}
