import { ModuleMetadata } from "@nestjs/common";

export interface NamespaceDefinition {
  name?: string;
  base?: string;
}

export interface AsyncNamespaceFactory extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any[]
  ) => Promise<NamespaceDefinition[]> | NamespaceDefinition[];
  inject?: any[];
}

export interface InjectStorageOptions {
  namespace?: string;
  storageName?: string;
}
