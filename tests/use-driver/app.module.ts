import { Module } from "@nestjs/common";
import { UnestorageModule } from "../../lib";
import fsDriver from "unstorage/drivers/fs";
import { AppService } from "../common/app.service";
import { TEST_BASE_KEY } from "../common/constants";

@Module({
  imports: [
    UnestorageModule.forRoot({
      driver: fsDriver({
        base: TEST_BASE_KEY,
      }),
    }),
    UnestorageModule.forFeature([]),
  ],
  providers: [AppService],
})
export class AppModule {}
