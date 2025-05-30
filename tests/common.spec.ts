import { DynamicModule, Injectable, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { Storage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import { InjectNamespace, InjectStorage, UnestorageModule } from '../lib';
import { NamespaceDefinition } from '../lib/unestorage.interface';

const random = (length = 8) =>
  randomBytes(length).toString('hex').slice(0, length);
const namespace: NamespaceDefinition = {
  name: `namespace-${random(8)}`,
  base: `namespace:${random(8)}`,
};

@Injectable()
class AppService {
  constructor(@InjectStorage() public storage: Storage) {}
}

@Injectable()
class NamespaceService {
  constructor(@InjectNamespace(namespace.name) public storage: Storage) {}
}

const testCase: [string, DynamicModule, Provider][] = [
  ['Memory driver', UnestorageModule.register(), AppService],
  [
    'Memory driver with namespace',
    UnestorageModule.register({ namespaces: [namespace] }),
    NamespaceService,
  ],
  [
    'Memory driver (async)',
    UnestorageModule.registerAsync({ useFactory: () => ({}) }),
    AppService,
  ],
  [
    'Memory driver with namespace (async)',
    UnestorageModule.registerAsync({
      useFactory: () => ({}),
      namespaces: [namespace],
    }),
    NamespaceService,
  ],
  [
    'FS driver',
    UnestorageModule.register({ driver: fsDriver({ base: './.temp/common' }) }),
    AppService,
  ],
  [
    'FS driver with namespace',
    UnestorageModule.register({
      driver: fsDriver({ base: './.temp/common' }),
      namespaces: [namespace],
    }),

    NamespaceService,
  ],
  [
    'FS driver (async)',
    UnestorageModule.registerAsync({
      useFactory: () => ({ driver: fsDriver({ base: './.temp/common' }) }),
    }),
    AppService,
  ],
  [
    'FS driver with namespace (async)',
    UnestorageModule.registerAsync({
      useFactory: () => ({ driver: fsDriver({ base: './.temp/common' }) }),
      namespaces: [namespace],
    }),
    NamespaceService,
  ],
];

describe.each(testCase)(
  'Test %s',
  (_, module: DynamicModule, provider: Provider) => {
    let storage: Storage;
    let key: string;
    let value: string;

    beforeAll(async () => {
      const app = await Test.createTestingModule({
        imports: [module],
        providers: [provider],
      }).compile();
      const appService = app.get(provider as any);
      storage = appService.storage;
      key = `Key-${random(8)}`;
      value = `Val-${random(8)}`;
    });

    it('should be defined', () => {
      expect(storage).toBeDefined();
    });

    it('should set and get an item', async () => {
      await storage.setItem(key, value);
      const result = await storage.getItem(key);
      expect(result).toBe(value);
    });

    it('should remove an item', async () => {
      await storage.removeItem(key);
      const result = await storage.getItem(key);
      expect(result).toBeNull();
    });
  },
);
