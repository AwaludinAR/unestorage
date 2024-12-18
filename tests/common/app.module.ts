import { Module } from "@nestjs/common";
import { UnestorageModule } from "../../lib";
import { AppService } from "./app.service";

@Module({
  imports: [UnestorageModule.forRoot({}), UnestorageModule.forFeature([])],
  providers: [AppService],
})
export class AppModule {}
