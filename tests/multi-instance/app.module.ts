import { Module } from "@nestjs/common";
import { UnestorageModule } from "../../lib";
import fsDriver from "unstorage/drivers/fs";
import memoryDriver from "unstorage/drivers/memory";
import { TEST_BASE_KEY } from "../common/constants";
import { AppService } from "./app.service";

@Module({
  imports: [
    UnestorageModule.forRoot({ storageName: "memory", driver: memoryDriver() }),
    UnestorageModule.forRoot({
      storageName: "fs",
      driver: fsDriver({
        base: TEST_BASE_KEY,
      }),
    }),
    UnestorageModule.forFeature([], "memory"),
    UnestorageModule.forFeature([], "fs"),
  ],
  providers: [AppService],
})
export class AppModule {}
