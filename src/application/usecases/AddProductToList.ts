import { MongoHelper } from "../../infra/db/MongoHelper";
import GetList from "./GetList";
import GetProduct from "./GetProduct";

export default class AddProductToList {
  constructor (readonly getList: GetList, readonly getProduct: GetProduct) {
  }

  async execute (input: Input) {
    const list = await this.getList.execute(input.listId);
    if (!list) 
      throw new Error("Invalid list");
    if (!input.productsIds?.length)
      throw new Error("Products not provided");
    for (const productId of input.productsIds) {
      await this.getProduct.execute(productId);
    }
    const listsCollection = await MongoHelper.getCollection("lists");
    await listsCollection.updateOne({
      listId: input.listId
    }, {
      $set: {
        products: [...list.products, ...input.productsIds]
      }
    });
  }
}

type Input = {
  listId: string;
  productsIds: string[];
}