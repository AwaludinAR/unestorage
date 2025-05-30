import { Inject } from '@nestjs/common';
import { getNamespaceToken } from '../../utils';

export const InjectNamespace = (namespace: string, storageName?: string) =>
  Inject(getNamespaceToken(namespace, storageName));
