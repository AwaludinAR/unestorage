import { Module } from "@nestjs/common";
import { UnestorageModule } from "../../lib";
import fsDriver from "unstorage/drivers/fs";
import { AppService } from "../common/app.service";

@Module({
  imports: [
    UnestorageModule.forRoot({
      driver: fsDriver({
        base: "./.temp",
      }),
    }),
    UnestorageModule.forFeature([]),
  ],
  providers: [AppService],
})
export class AppModule {}
