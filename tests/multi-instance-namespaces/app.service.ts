import { Injectable } from "@nestjs/common";
import { Storage } from "unstorage";
import { InjectStorage } from "../../lib";
import { TEST_NAMESPACE1, TEST_NAMESPACE2 } from "../multi-instance/constants";

@Injectable()
export class AppService {
  constructor(
    @InjectStorage({ namespace: TEST_NAMESPACE1.name, storageName: "memory" })
    public storage1: Storage,
    @InjectStorage({ namespace: TEST_NAMESPACE2.name, storageName: "fs" })
    public storage2: Storage
  ) {}
}
