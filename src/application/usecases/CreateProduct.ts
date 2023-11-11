import crypto from "crypto";
import { MongoHelper } from "../../infra/db/MongoHelper";

export default class CreateProduct {
  constructor () {
  }

  async execute (input: Input) {
    const productId = crypto.randomUUID().toString();
    const productInput = {
      productId: productId,
      code: input.code,
      name: input.name,
      measure: input.measure,
      unity: input.unity
    };
    const productColletion = await MongoHelper.getCollection("products");
    await productColletion.insertOne(productInput);
    return {
      productId
    };
  }
}

type Input = {
  code: string;
  name: string;
  measure: number;
  unity: string;
}