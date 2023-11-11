import { MongoHelper } from "../../infra/db/MongoHelper";

export default class GetProduct {
  constructor () {
  }

  async execute (productId: string) {
    const productColletion = await MongoHelper.getCollection("products");
    const product = await productColletion.findOne({
      productId: productId
    });
    return product;
  }
}