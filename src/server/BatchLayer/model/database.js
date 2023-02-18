let mongoose = require("mongoose");
require("dotenv").config();

const server = process.env.DB_CONNECT;
const database = process.env.DB_COLLECTION;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(`${server}/${database}`)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
