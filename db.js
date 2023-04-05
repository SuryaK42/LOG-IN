const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let database;

async function getDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = await client.db("login");
  return database;
}

module.exports = {
  getDatabase,
};

// const database = await dbo.getDatabase();
// const collection = await database.collection("data");
// await collection.insertOne({ name: "hiii" });
