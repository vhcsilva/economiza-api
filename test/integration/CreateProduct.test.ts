import 'dotenv/config';

import CreateProduct from "../../src/CreateProduct";
import { MongoHelper } from "../../src/MongoHelper";
import GetProduct from '../../src/GetProduct';

describe("CreateProduct", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.DB_CONNECTION_URL);
  });

  test("Should create a product", async () => {
    const createProductInput = {
      code: "7896084700027",
      name: "ARROZ PARBOILIZADO TIPO 1 KIARROZ",
      measure: 1,
      unity: "kg"
    };
    const createProduct = new CreateProduct();
    const createProductOutput = await createProduct.execute(createProductInput);
    const getProduct = new GetProduct();
    const getProductOutput = await getProduct.execute(createProductOutput.productId);
    expect(getProductOutput.productId).toBe(createProductOutput.productId);
    expect(getProductOutput.code).toBe(createProductInput.code);
    expect(getProductOutput.name).toBe(createProductInput.name);
    expect(getProductOutput.measure).toBe(createProductInput.measure);
    expect(getProductOutput.unity).toBe(createProductInput.unity);
  });

  afterAll(async () => {
    const productsCollection = await MongoHelper.getCollection("products");
    await productsCollection.deleteMany();
    await MongoHelper.disconnect();
  });
});