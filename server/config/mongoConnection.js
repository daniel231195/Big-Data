import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const server = process.env.DB_CONNECT;
const database = process.env.DB_COLLECTION;

export class Database {
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
