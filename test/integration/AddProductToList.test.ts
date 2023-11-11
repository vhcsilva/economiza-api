import 'dotenv/config';

import AddProductToList from "../../src/application/usecases/AddProductToList";
import CreateList from "../../src/application/usecases/CreateList";
import CreateProduct from "../../src/application/usecases/CreateProduct";
import GetList from "../../src/application/usecases/GetList";
import GetProduct from "../../src/application/usecases/GetProduct";
import { MongoHelper } from "../../src/infra/db/MongoHelper";

describe("AddProductToList", () => {
  let createProduct: CreateProduct;
  let getProduct: GetProduct;
  let createList: CreateList;
  let getList: GetList;
  let addProductToList: AddProductToList;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.DB_CONNECTION_URL);
    createProduct = new CreateProduct();
    getProduct = new GetProduct();
    createList = new CreateList();
    getList = new GetList();
    addProductToList = new AddProductToList(getList, getProduct);
  });

  test("Should add products to a list", async () => {
    const createProductInput1 = {
      code: "7896084700027",
      name: "ARROZ PARBOILIZADO TIPO 1 KIARROZ",
      measure: 1,
      unity: "kg"
    };
    const createProductInput2 = {
      code: "7896006746157",
      name: "FEIJAO CARIOCA POP",
      measure: 1,
      unity: "kg"
    };
    const createProductOutput1 = await createProduct.execute(createProductInput1);
    const createProductOutput2 = await createProduct.execute(createProductInput2);
    const createListInput = {
      name: "Market November 2023"
    };
    const createListOutput = await createList.execute(createListInput);
    const addProductToListInput = {
      listId: createListOutput.listId,
      productsIds: [createProductOutput1.productId, createProductOutput2.productId]
    };
    await addProductToList.execute(addProductToListInput);
  });

  test("Should throw if invalid list is provided", async () => {
    const addProductToListInput = {
      listId: "INVALID_ID",
      productsIds: ["ANY_ID", "ANY_ID"]
    };
    await expect(() => addProductToList.execute(addProductToListInput)).rejects.toThrowError(new Error("Invalid list"));
  });

  test("Should throw if products are not provided", async () => {
    const createListInput = {
      name: "Market November 2023"
    };
    const createListOutput = await createList.execute(createListInput);
    const withEmptyArrayInput = {
      listId: createListOutput.listId,
      productsIds: []
    };
    await expect(() => addProductToList.execute(withEmptyArrayInput)).rejects.toThrowError(new Error("Products not provided"));
  });

  test("Should throw if a product is invalid", async () => {
    const createListInput = {
      name: "Market November 2023"
    };
    const createListOutput = await createList.execute(createListInput);
    const createProductInput = {
      code: "7896006746157",
      name: "FEIJAO CARIOCA POP",
      measure: 1,
      unity: "kg"
    };
    const createProductOutput = await createProduct.execute(createProductInput);
    const withEmptyArrayInput = {
      listId: createListOutput.listId,
      productsIds: [createProductOutput.productId, "INVALID_ID"]
    };
    await expect(() => addProductToList.execute(withEmptyArrayInput)).rejects.toThrowError(new Error("Product not found: INVALID_ID"));
  });

  afterAll(async () => {
    const productsCollection = await MongoHelper.getCollection("products");
    const listsCollection = await MongoHelper.getCollection("lists");
    await productsCollection.deleteMany();
    await listsCollection.deleteMany();
    await MongoHelper.disconnect();
  });
});