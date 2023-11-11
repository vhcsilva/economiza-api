import crypto from "crypto";
import { MongoHelper } from "../../infra/db/MongoHelper";

export default class CreateList {
  constructor () {
  }

  async execute (input: Input) {
    const listId = crypto.randomUUID().toString();
    const listInput = {
      listId: listId,
      name: input.name
    };
    const listsCollection = await MongoHelper.getCollection("lists");
    await listsCollection.insertOne(listInput);
    return {
      listId
    };
  }
}

type Input = {
  name: string;
}