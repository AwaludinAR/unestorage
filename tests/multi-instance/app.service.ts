import { Injectable } from "@nestjs/common";
import { InjectStorage } from "../../lib";
import { Storage } from "unstorage";

@Injectable()
export class AppService {
  constructor(
    @InjectStorage({ storageName: "memory" })
    public storage1: Storage,
    @InjectStorage({ storageName: "fs" })
    public storage2: Storage
  ) {}
}
