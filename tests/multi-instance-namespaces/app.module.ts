import { Module } from "@nestjs/common";
import { UnestorageModule } from "../../lib";
import memoryDriver from "unstorage/drivers/memory";
import fsDriver from "unstorage/drivers/fs";
import { TEST_BASE_KEY } from "../common/constants";
import { AppService } from "../multi-instance/app.service";
import { AppService as NamespaceService } from "./app.service";
import { TEST_NAMESPACE1, TEST_NAMESPACE2 } from "../multi-instance/constants";

@Module({
  imports: [
    UnestorageModule.forRoot({
      storageName: "memory",
      driver: memoryDriver(),
    }),
    UnestorageModule.forRoot({
      storageName: "fs",
      driver: fsDriver({
        base: TEST_BASE_KEY,
      }),
    }),
    UnestorageModule.forFeature([TEST_NAMESPACE1], "memory"),
    UnestorageModule.forFeature([TEST_NAMESPACE2], "fs"),
  ],
  providers: [
    {
      provide: AppService,
      useClass: NamespaceService,
    },
  ],
})
export class AppModule {}
