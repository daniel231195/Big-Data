const mongo = require("../model/PizzaOrder");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const client = new MongoClient(process.env.DB_CONNECT);

const dbName = "test",
  collectionName = "pizzaOrders";

/**
 * @description Inserts a new order to the database
 */
const insertOrder = async (req, res) => {
  const data = req.body;
  try {
    await client.connect();
    await client.db(dbName).collection(collectionName).insertOne(data);
    res.json({
      message: "Inserted",
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

/**
 * @description Returns all Orders from the database
 */
const getAllOrder = async (req, res) => {
  try {
    await client.connect();
    const all = await client
      .db(dbName)
      .collection(collectionName)
      .find()
      .toArray();
    res.json(all);
    client.close();
  } catch (error) {
    console.log(error);
  }
};
/**
 * @description Deletes all Orders from the database
 */
const deleteAllOrders = async (req, res) => {
  try {
    await client.connect();
    await client.db(dbName).collection(collectionName).deleteMany({});
    res.json({
      message: "All documents deleted",
    });
    client.close();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllOrder,
  insertOrder,
  deleteAllOrders,
};
