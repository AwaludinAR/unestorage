import { Inject } from "@nestjs/common";
import { getNamespaceToken, getStorageToken } from "./unestorage.utils";

export function InjectStorage(namespace?: string, storageName?: string) {
  return Inject(getNamespaceToken(namespace, storageName));
}

export function InjectUnstorage(storageName?: string) {
  return Inject(getStorageToken(storageName));
}
