import { ModuleMetadata, Type } from "@nestjs/common";
import { CreateStorageOptions } from "unstorage";

export interface UnestorageModuleOptions extends CreateStorageOptions {
  storageName?: string;
  storageFactory?: (storage: any, name: string) => any;
}

export interface UnestorageModuleFactoryOptions
  extends Omit<UnestorageModuleOptions, "storageName"> {}

export interface UnestorageOptionsFactory {
  createUnestorageOptions():
    | Promise<UnestorageModuleOptions>
    | UnestorageModuleOptions;
}

export interface UnestorageModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  storageName?: string;
  useExisting?: Type<UnestorageOptionsFactory>;
  useClass?: Type<UnestorageOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<UnestorageModuleFactoryOptions> | UnestorageModuleFactoryOptions;
  inject?: any[];
}
