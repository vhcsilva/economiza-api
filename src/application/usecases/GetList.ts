import { MongoHelper } from "../../infra/db/MongoHelper";

export default class GetList {
  constructor () {
  }

  async execute (listId: string) {
    const listsCollection = await MongoHelper.getCollection("lists");
    const list = await listsCollection.findOne({
      listId: listId
    });
    return list;
  }
}