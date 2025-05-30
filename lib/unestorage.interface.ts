import { ModuleMetadata, Type } from '@nestjs/common';
import { CreateStorageOptions } from 'unstorage';

export interface NamespaceDefinition {
  name: string;
  base: string;
}

export interface UnestorageModuleOptions extends CreateStorageOptions {
  storageName?: string;
  namespaces?: NamespaceDefinition[];
  global?: boolean;
}

export interface UnestorageOptionsFactory {
  createUnestorageOptions():
    | Promise<UnestorageModuleOptions>
    | UnestorageModuleOptions;
}

export type UnestorageModuleFactoryOptions = Omit<
  UnestorageModuleOptions,
  'storageName' | 'namespaces'
>;

export interface UnestorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  storageName?: string;
  namespaces?: NamespaceDefinition[];
  global?: boolean;
  useExisting?: Type<UnestorageOptionsFactory>;
  useClass?: Type<UnestorageOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<UnestorageModuleFactoryOptions> | UnestorageModuleFactoryOptions;
  inject?: any[];
}
