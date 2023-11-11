import 'dotenv/config';

import { MongoHelper } from "../../src/infra/db/MongoHelper";
import CreateList from '../../src/application/usecases/CreateList';
import GetList from '../../src/application/usecases/GetList';

describe("CreateList", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.DB_CONNECTION_URL);
  });

  test("Should create a list", async () => {
    const createListInput = {
      name: "Market November 2023"
    };
    const createList = new CreateList();
    const createListOutput = await createList.execute(createListInput);
    const getList = new GetList();
    const getListOutput = await getList.execute(createListOutput.listId);
    expect(getListOutput.listId).toBe(createListOutput.listId);
    expect(getListOutput.name).toBe(createListInput.name);
  });

  afterAll(async () => {
    const listsCollection = await MongoHelper.getCollection("lists");
    await listsCollection.deleteMany();
    await MongoHelper.disconnect();
  });
});