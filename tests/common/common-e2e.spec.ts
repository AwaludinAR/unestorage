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

  describe("Object Data", () => {
    it("Should be able to store Object", async () => {
      await appRef.setData(TEST_DATA_KEY, TEST_OBJECT_DATA);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toEqual(TEST_OBJECT_DATA);
    });

    it("Should be able to delete Object", async () => {
      await appRef.setData(TEST_DATA_KEY, TEST_OBJECT_DATA);
      await appRef.deleteData(TEST_DATA_KEY);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toBeNull();
    });
  });

  describe("String Data", () => {
    it("Should be able to store String", async () => {
      await appRef.setData(TEST_DATA_KEY, TEST_STRING_DATA);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toEqual(TEST_STRING_DATA);
    });

    it("Should be able to delete String", async () => {
      await appRef.setData(TEST_DATA_KEY, TEST_STRING_DATA);
      await appRef.deleteData(TEST_DATA_KEY);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toBeNull();
    });
  });

  describe("Array Data", () => {
    it("Should be able to store Array", async () => {
      await appRef.setData(TEST_DATA_KEY, [TEST_OBJECT_DATA]);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toEqual([TEST_OBJECT_DATA]);
    });

    it("Should be able to delete Array", async () => {
      await appRef.setData(TEST_DATA_KEY, [TEST_OBJECT_DATA]);
      await appRef.deleteData(TEST_DATA_KEY);
      const data = await appRef.getData(TEST_DATA_KEY);
      expect(data.data).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
