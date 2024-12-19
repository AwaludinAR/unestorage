import { Injectable } from "@nestjs/common";
import { InjectStorage } from "../../lib";
import { Storage } from "unstorage";

@Injectable()
export class AppService {
  constructor(@InjectStorage() public storage: Storage) {}
}
