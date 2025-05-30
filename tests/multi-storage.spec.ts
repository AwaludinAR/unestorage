import { DynamicModule, Injectable, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { Storage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import { InjectNamespace, InjectStorage, UnestorageModule } from '../lib';
import { NamespaceDefinition } from '../lib/unestorage.interface';

const random = (length = 8) =>
  randomBytes(length).toString('hex').slice(0, length);

const storage1 = `storage${random(8)}`;
const storage2 = `storage${random(8)}`;
const namespace: NamespaceDefinition = {
  name: `namespace-${random(8)}`,
  base: `namespace:${random(8)}`,
};

@Injectable()
export class AppService {
  constructor(
    @InjectStorage(storage1) public storage1: Storage,
    @InjectStorage(storage2) public storage2: Storage,
  ) {}
}

@Injectable()
class NamespaceService {
  constructor(
    @InjectNamespace(namespace.name, storage1) public storage1: Storage,
    @InjectNamespace(namespace.name, storage2) public storage2: Storage,
  ) {}
}

const testCase: [string, DynamicModule[], Provider][] = [
  [
    'Memory driver',
    [
      UnestorageModule.register({ storageName: storage1 }),
      UnestorageModule.register({ storageName: storage2 }),
    ],
    AppService,
  ],
  [
    'Memory driver with namespace',
    [
      UnestorageModule.register({
        storageName: storage1,
        namespaces: [namespace],
      }),
      UnestorageModule.register({
        storageName: storage2,
        namespaces: [namespace],
      }),
    ],
    NamespaceService,
  ],
  [
    'Memory driver (async)',
    [
      UnestorageModule.registerAsync({
        storageName: storage1,
        useFactory: () => ({}),
      }),
      UnestorageModule.registerAsync({
        storageName: storage2,
        useFactory: () => ({}),
      }),
    ],
    AppService,
  ],
  [
    'Memory driver with namespace (async)',
    [
      UnestorageModule.registerAsync({
        storageName: storage1,
        useFactory: () => ({}),
        namespaces: [namespace],
      }),
      UnestorageModule.registerAsync({
        storageName: storage2,
        useFactory: () => ({}),
        namespaces: [namespace],
      }),
    ],
    NamespaceService,
  ],
  [
    'FS driver',
    [
      UnestorageModule.register({
        storageName: storage1,
        driver: fsDriver({ base: `./.temp/multi/${storage1}` }),
      }),
      UnestorageModule.register({
        storageName: storage2,
        driver: fsDriver({ base: `./.temp/multi/${storage2}` }),
      }),
    ],
    AppService,
  ],
  [
    'FS driver with namespace',
    [
      UnestorageModule.register({
        storageName: storage1,
        driver: fsDriver({ base: `./.temp/multi/${storage1}` }),
        namespaces: [namespace],
      }),
      UnestorageModule.register({
        storageName: storage2,
        driver: fsDriver({ base: `./.temp/multi/${storage2}` }),
        namespaces: [namespace],
      }),
    ],
    NamespaceService,
  ],
  [
    'FS driver (async)',
    [
      UnestorageModule.registerAsync({
        storageName: storage1,
        useFactory: () => ({
          driver: fsDriver({ base: `./.temp/multi/${storage1}` }),
        }),
      }),
      UnestorageModule.registerAsync({
        storageName: storage2,
        useFactory: () => ({
          driver: fsDriver({ base: `./.temp/multi/${storage2}` }),
        }),
      }),
    ],
    AppService,
  ],
  [
    'FS driver with namespace (async)',
    [
      UnestorageModule.registerAsync({
        storageName: storage1,
        namespaces: [namespace],
        useFactory: () => ({
          driver: fsDriver({ base: `./.temp/multi/${storage1}` }),
        }),
      }),
      UnestorageModule.registerAsync({
        storageName: storage2,
        namespaces: [namespace],
        useFactory: () => ({
          driver: fsDriver({ base: `./.temp/multi/${storage2}` }),
        }),
      }),
    ],
    NamespaceService,
  ],
];

describe.each(testCase)(
  'Test %s',
  (_, modules: DynamicModule[], provider: Provider) => {
    let storage1: Storage;
    let storage2: Storage;
    let key: string;
    let value: string;

    beforeAll(async () => {
      const app = await Test.createTestingModule({
        imports: modules,
        providers: [provider],
      }).compile();
      const appService = app.get(provider as any);
      storage1 = appService.storage1;
      storage2 = appService.storage2;
      key = `Key-${random(8)}`;
      value = `Val-${random(8)}`;
    });

    it('should be defined', () => {
      expect(storage1).toBeDefined();
      expect(storage2).toBeDefined();
    });

    it('should set and get an item', async () => {
      await storage1.setItem(key, value);
      const result = await storage1.getItem(key);
      expect(result).toBe(value);
    });

    it('should remove an item', async () => {
      await storage1.removeItem(key);
      const result = await storage1.getItem(key);
      expect(result).toBeNull();
    });
  },
);
