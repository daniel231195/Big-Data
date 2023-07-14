import { consumer } from "../kafka/mongoConsumer.js";
import dotenv from "dotenv";
// import { Database } from "../config/database.js";
import Order from "../models/Order.js";
dotenv.config();

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
          console.log(err);
        });
    } else if (message.topic === "delivered") {
      markOrderAsReady(message.orderId, message.servedTime);
    }
  });
};
