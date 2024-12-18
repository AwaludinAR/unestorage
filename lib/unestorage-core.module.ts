import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { UnestorageModuleOptions } from "./interfaces";
import { createStorage, CreateStorageOptions } from "unstorage";
import { getStorageToken } from "./common";
import { UNESTORAGE_STORAGE_NAME } from "./unestorage.constants";

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

  private static createStorage(options: CreateStorageOptions) {
    return createStorage(options);
  }
}
