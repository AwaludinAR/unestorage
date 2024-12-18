import {
  UNESTORAGE_DEFAULT_NAMESPACE,
  UNESTORAGE_DEFAULT_STORAGE_NAME,
} from "../unestorage.constants";

export function getNamespaceToken(name?: string, storageName?: string) {
  name = name || UNESTORAGE_DEFAULT_NAMESPACE;
  storageName = storageName || UNESTORAGE_DEFAULT_STORAGE_NAME;
  // if (storageName === undefined) {
  //   return `${name}Namespace`;
  // }

  return `${getStorageToken(storageName)}/${name}Namespace`;
}

export function getStorageToken(name?: string) {
  return name && name !== UNESTORAGE_DEFAULT_STORAGE_NAME
    ? `${name}Storage`
    : UNESTORAGE_DEFAULT_STORAGE_NAME;
}
