import { DynamicModule, Module } from "@nestjs/common";
import {
  AsyncNamespaceFactory,
  NamespaceDefinition,
  UnestorageModuleAsyncOptions,
  UnestorageModuleOptions,
} from "./interfaces";
import { UnestorageCoreModule } from "./unestorage-core.module";
import { createUnestorageProviders } from "./unestorage.providers";

@Module({})
export class UnestorageModule {
  public static forRoot(opts: UnestorageModuleOptions): DynamicModule {
    return {
      module: UnestorageModule,
      imports: [UnestorageCoreModule.forRoot(opts)],
    };
  }

  public static forRootAsync(
    opts: UnestorageModuleAsyncOptions
  ): DynamicModule {
    return {
      module: UnestorageModule,
      imports: [UnestorageCoreModule.forRootAsync(opts)],
    };
  }

  public static forFeature(
    namespaces: NamespaceDefinition[],
    storageName?: string
  ): DynamicModule {
    const providers = createUnestorageProviders(storageName, namespaces);
    return {
      module: UnestorageModule,
      providers: providers,
      exports: providers,
    };
  }

  // TODO: add forFeatureAsync
  public static forRootFeature(
    namespaces: AsyncNamespaceFactory[] = [],
    storageName?: string
  ) {}
}
