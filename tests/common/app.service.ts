import { Injectable } from "@nestjs/common";
import { InjectStorage } from "../../lib";
import { Storage } from "unstorage";

@Injectable()
export class AppService {
  constructor(@InjectStorage() private storage: Storage) {}

  public async setData(path: string, data: any) {
    await this.storage.setItem(path, data);
    return {
      path,
      data: await this.storage.getItem(path),
    };
  }

  public async getData(path: string) {
    return {
      path,
      data: await this.storage.getItem(path),
    };
  }

  public async deleteData(path: string) {
    await this.storage.removeItem(path);
    return {
      path,
      data: await this.storage.getItem(path),
    };
  }
}
