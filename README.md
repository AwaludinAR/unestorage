# unestorage

[NestJS](https://nestjs.com) module for [unstorage](https://unstorage.unjs.io/).

## Getting Started

```bash
npm install unestorage unstorage
```

## Usage

Register the `UnestorageModule` module

```typescript
import { Module } from '@nestjs/common';
import { UnestorageModule } from 'unestorage';

@Module({
  import: [UnestorageModule.register()],
})
export class AppModule {}
```

Inject Storage

```typescript
import { Injectable } from '@nestjs/common';
import { InjectStorage } from 'unestorage';
import { Storage } from 'unstorage';

@Injectable()
export class MyService {
  constructor(@InjectStorage() private readonly storage: Storage) {}

  async getData(key: string): Promise<any> {
    return this.storage.getItem(key);
  }

  async setData(key: string, value: any): Promise<void> {
    await this.storage.setItem(key, value);
  }
}
```

## With driver

Please see [unstorage drivers](https://unstorage.unjs.io/drivers) for more information.

```typescript
import { Module } from '@nestjs/common';
import { UnestorageModule } from 'unestorage';
import fsDriver from 'unstorage/drivers/fs';

@Module({
  imports: [
    UnestorageModule.register({
      driver: fsDriver({
        base: '/path/to/storage',
      }),
    }),
  ],
})
export class AppModule {}
```

## Multiple storages

You can register multiple storages by providing a name for each storage.

> [!WARNING]
> Please note that you shouldn't have multiple storage without a name, or with the same name,

```typescript
import { Module } from '@nestjs/common';
import { UnestorageModule } from 'unestorage';
import fsDriver from 'unstorage/drivers/fs';

@Module({
  imports: [
    UnestorageModule.register({
      storageName: 'default',
      driver: fsDriver({
        base: '/path/to/default/storage',
      }),
    }),
    UnestorageModule.register({
      storageName: 'backup',
      driver: fsDriver({
        base: '/path/to/backup/storage',
      }),
    }),
  ],
})
export class AppModule {}
```

## Injecting multiple storages

You can inject multiple storages by providing the name of the storage you want to inject.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectStorage } from 'unestorage';
import { Storage } from 'unstorage';

@Injectable()
export class MyService {
  constructor(
    @InjectStorage('default') private readonly defaultStorage: Storage,
    @InjectStorage('backup') private readonly backupStorage: Storage,
  ) {}

  async getDefaultData(key: string): Promise<any> {
    return this.defaultStorage.getItem(key);
  }

  async getBackupData(key: string): Promise<any> {
    return this.backupStorage.getItem(key);
  }

  async setDefaultData(key: string, value: any): Promise<void> {
    await this.defaultStorage.setItem(key, value);
  }

  async setBackupData(key: string, value: any): Promise<void> {
    await this.backupStorage.setItem(key, value);
  }
}
```

## Namespace (Utility)

Please see [unstorage namespace](https://unstorage.unjs.io/guide/utils) for more information.

`Unestorage` add `name` option for easy injection in `@InjectNamespace` decorator.

Register the `UnestorageModule` module with `namespaces` option

```typescript
import { Module } from '@nestjs/common';
import { UnestorageModule } from 'unestorage';

@Module({
  imports: [
    UnestorageModule.register({
      namespaces: [{ name: 'MyNamesapce', base: 'namespace:base' }],
    }),
  ],
})
```

Inject namespace

```typescript
import { Injectable } from '@nestjs/common';
import { InjectNamespace } from 'unestorage';
import { Storage } from 'unstorage';

@Injectable()
export class MyService {
  constructor(
    @InjectNamespace('MyNamesapce') private readonly namespace: Storage,
  ) {}

  async getData(key: string): Promise<any> {
    return this.namespace.getItem(key);
  }

  async setData(key: string, value: any): Promise<void> {
    await this.namespace.setItem(key, value);
  }
}
```

> [!WARNING]
> If you are using multiple storages, you must include the `storageName` parameter in the `@InjectNamespace` decorator.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectNamespace } from 'unestorage';
import { Storage } from 'unstorage';

@Injectable()
export class MyService {
  constructor(
    @InjectNamespace('MyNamesapce', 'storageName') // specify the storage name.
    private readonly namespace: Storage,
  ) {}

  async getData(key: string): Promise<any> {
    return this.namespace.getItem(key);
  }

  async setData(key: string, value: any): Promise<void> {
    await this.namespace.setItem(key, value);
  }
}
```
