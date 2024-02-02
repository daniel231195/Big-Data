import { consumer } from "../kafka/mongoConsumer.js";
import dotenv from "dotenv";
// import { Database } from "../config/database.js";
import Order from "../models/Order.js";
dotenv.config();

export async function getOrderServeTime(orderId) {
  try {
    const order = await Order.find(
      {
        orderId : orderId
      }
    )
    if (!order) {
      console.error(`Order with ID ${orderId} not found`);
      return null; // Or you can throw an error here if you prefer
    }

    console.log(order);
    return order;
  } catch (error) {
    console.error(error.message);
    throw error; // Rethrow the error so it can be handled further up the call stack
  }
}
async function markOrderAsReady(orderId, servedTime) {
  try {
    console.log(servedTime);
    const result = await Order.updateOne(
      { orderId: orderId },
      { $set: { orderStatus: "delivered", orderServedTime: servedTime } }
    );
    console.log(`Order with id ${orderId} has been updated. Result: ${result}`);
  } catch (error) {
    console.error(`Error updating order with id ${orderId}: ${error}`);
  }
}
export const mongoListener = () => {
  consumer.on("data", (data) => {
    const message = JSON.parse(data.value.toString());
    // console.log(message);
    if (message.topic === "order") {
      const pizzaOrder = new Order(JSON.parse(data.value));
      pizzaOrder
        .save()
        .then((doc) => {
          console.log(
            `Order with id ${message.orderId} has been uploaded to mongo.`
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (message.topic === "delivered") {
      markOrderAsReady(message.orderId, message.servedTime);
    }
  });
};
