import { Inject } from '@nestjs/common';
import { getStorageToken } from '../../utils';

export const InjectStorage = (storageName?: string) =>
  Inject(getStorageToken(storageName));
