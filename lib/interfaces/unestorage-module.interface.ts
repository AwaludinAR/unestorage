import { CreateStorageOptions } from "unstorage";

export interface UnestorageModuleOptions extends CreateStorageOptions {
  storageName?: string;
  storageFactory?: (storage: any, name: string) => any;
}
