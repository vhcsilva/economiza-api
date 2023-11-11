import { MongoHelper } from "../../infra/db/MongoHelper";

export default class GetProduct {
  constructor () {
  }

  async execute (productId: string): Promise<Output> {
    const productColletion = await MongoHelper.getCollection("products");
    const product = await productColletion.findOne({
      productId: productId
    });
    if (!product)
      throw new Error(`Product not found: ${productId}`);
    return {
      productId: product.productId,
      code: product.code,
      name: product.name,
      measure: product.measure,
      unity: product.unity,
    };
  }
}

type Output = {
  productId: string,
  code: string,
  name: string,
  measure: number,
  unity: string
}