import { Inject } from "@nestjs/common";
import { getNamespaceToken, getStorageToken } from "./unestorage.utils";
import { InjectStorageOptions } from "../interfaces";

export function InjectStorage(opts?: string | InjectStorageOptions) {
  if (!opts || typeof opts === "string") {
    return Inject(getNamespaceToken(opts));
  }

  const { namespace, storageName } = opts;
  return Inject(getNamespaceToken(namespace, storageName));
}

export function InjectUnstorage(storageName?: string) {
  return Inject(getStorageToken(storageName));
}
