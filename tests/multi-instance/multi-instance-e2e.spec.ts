import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppService } from "./app.service";
import {
  TEST_DATA_KEY,
  TEST_OBJECT_DATA,
  TEST_STRING_DATA,
} from "../common/constants";

import { AppModule as WithoutNamespace } from "./app.module";
import { AppModule as WithNamespace } from "../multi-instance-namespaces/app.module";
import { TEST_NAMESPACE1, TEST_NAMESPACE2 } from "./constants";

describe.each`
  AppModule           | with
  ${WithoutNamespace} | ${"Without"}
  ${WithNamespace}    | ${"With"}
`("AppModule $with namespace", ({ AppModule }) => {
  let app: INestApplication;
  let appRef: AppService;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    appRef = app.get(AppService);
  });

  it("should set and get data", async () => {
    await appRef.storage1.setItem(TEST_DATA_KEY, TEST_OBJECT_DATA);
    expect(await appRef.storage1.getItem(TEST_DATA_KEY)).toEqual(
      TEST_OBJECT_DATA
    );

    await appRef.storage2.setItem(TEST_DATA_KEY, TEST_OBJECT_DATA);
    expect(await appRef.storage2.getItem(TEST_DATA_KEY)).toEqual(
      TEST_OBJECT_DATA
    );
  });

  it("should get all keys", async () => {
    await appRef.storage1.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
    if (AppModule === WithNamespace) {
      expect(await appRef.storage1.keys()).toMatchObject([
        `${TEST_NAMESPACE1.base}:${TEST_DATA_KEY}`,
      ]);
    } else {
      expect(await appRef.storage2.keys()).toMatchObject([TEST_DATA_KEY]);
    }

    await appRef.storage2.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
    if (AppModule === WithNamespace) {
      expect(await appRef.storage2.keys()).toMatchObject([
        `${TEST_NAMESPACE2.base}:${TEST_DATA_KEY}`,
      ]);
    } else {
      expect(await appRef.storage2.keys()).toMatchObject([TEST_DATA_KEY]);
    }
  });

  it("should delete data", async () => {
    await appRef.storage1.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
    await appRef.storage1.removeItem(TEST_DATA_KEY);
    expect(await appRef.storage1.getItem(TEST_DATA_KEY)).toBeNull();

    await appRef.storage2.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
    await appRef.storage2.removeItem(TEST_DATA_KEY);
    expect(await appRef.storage2.getItem(TEST_DATA_KEY)).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
