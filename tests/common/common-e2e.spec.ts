import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppService } from "./app.service";
import { TEST_DATA_KEY, TEST_OBJECT_DATA, TEST_STRING_DATA } from "./constants";

import { AppModule as WithoutDriver } from "./app.module";
import { AppModule as WithDriver } from "../use-driver/app.module";

describe.each`
  AppModule        | with
  ${WithoutDriver} | ${"Without"}
  ${WithDriver}    | ${"With"}
`("AppModule $with driver", ({ AppModule }) => {
  let app: INestApplication;
  let appRef: AppService;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    appRef = app.get(AppService);
  });

  describe("storage", () => {
    it("should set and get data", async () => {
      await appRef.storage.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
      expect(await appRef.storage.getItem(TEST_DATA_KEY)).toBe(
        TEST_STRING_DATA
      );

      await appRef.storage.setItem(TEST_DATA_KEY, TEST_OBJECT_DATA);
      expect(await appRef.storage.getItem(TEST_DATA_KEY)).toEqual(
        TEST_OBJECT_DATA
      );
    });

    it("should get all keys", async () => {
      await appRef.storage.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
      expect(await appRef.storage.keys()).toMatchObject([TEST_DATA_KEY]);
    });

    it("should delete data", async () => {
      await appRef.storage.setItem(TEST_DATA_KEY, TEST_STRING_DATA);
      await appRef.storage.removeItem(TEST_DATA_KEY);
      expect(await appRef.storage.getItem(TEST_DATA_KEY)).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
