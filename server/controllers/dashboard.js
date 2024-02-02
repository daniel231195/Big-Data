import redisConsumer from "../kafka/redisConsumer.js";
import redisClient from "../config/redisConnection.js";
import processData, {
  handleDelivered,
  updateAllOrdersArray,
  updateOrdersDataArray,
  handleEvent,
} from "../models/OrderProcess.js";
import { SIMULATION_STOPPED } from "./simulation.js";
export const deliveredProcess = async (order, ordersData, allOrders) => {
  await handleDelivered(order, ordersData, allOrders);
};
const handleStopEvent = async (orderBuffer, ordersData, allOrders, multi) => {
  while (orderBuffer.length > 0) {
    const order = orderBuffer.pop();
    if (order.topic === "order") {
      await processData(order, ordersData, allOrders);
    } else if (order.topic === "delivered") {
      await deliveredProcess(order, ordersData, allOrders);
    } else if (order.topic === "event") {
      await handleEvent(order, ordersData);
    }
    await updateOrdersDataArray(ordersData, multi);
    await updateAllOrdersArray(allOrders, multi);
  }
};

export const redisListener = async () => {
  let index = 0;
  const BUFFER_THRESHOLD = 10;
  const orderBuffer = [];
  const multi = redisClient.multi();
  let stopFlag = false;
  redisConsumer.on("data", async (data) => {
    try {
      console.log(`message number: ${index++}`);
      let newOrder = await JSON.parse(data.value);
      let ordersData = await redisClient.json.get("ordersData");
      let allOrders = await redisClient.json.get("allOrders");
      orderBuffer.push(newOrder);
      if (newOrder.topic === SIMULATION_STOPPED) stopFlag = true;
      if (stopFlag) {
        await handleStopEvent(orderBuffer, ordersData, allOrders, multi);
      }

      if (orderBuffer.length > 0) {
        let orderCounter = 0;
        for (const order of orderBuffer) {
          console.log(`messages Counter: ${orderCounter++}`);
          if (order.topic === "order") {
            await processData(order, ordersData, allOrders);
          } else if (order.topic === "delivered") {
            await deliveredProcess(order, ordersData, allOrders, multi);
          } else if (order.topic === "event") {
            await handleEvent(newOrder, ordersData);
          }
          await updateOrdersDataArray(ordersData, multi);
          await updateAllOrdersArray(allOrders, multi);
        }
        orderBuffer.length = 0;
      }
      multi.exec((error, results) => {
        if (error) {
          console.error("Redis transaction error:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error(`dashboard redis problem: ${error}`);
      throw error;
    }
  });
};
// const updateAllOrdersArray = async (newOrder, allOrders, multi) => {
//   // Code to update allOrders array within the transaction
//   if (newOrder.topic === "order") {
//     multi.json.set("allOrders", 0, newOrder);
//   } else if (newOrder.topic === "delivered") {
//     const index = getIndexByOrderId(newOrder.orderId);
//     if (index > -1) {
//       allOrders[index].orderStatus = newOrder.topic;
//       allOrders[index].orderServedTime = newOrder.servedTime;
//       multi.json.set(
//         "allOrders[" + index + "]",
//         JSON.stringify(allOrders[index])
//       );
//     }
//   }
// };
export const getKeyValue = async (req, res) => {
  const key = req.params.key;
  try {
    const keyValue = await redisClient.json.get(key);
    return res.status(200).json(keyValue);
  } catch (error) {
    return res.status(404).json({ error: `${error}` });
  }
};
export const deleteSpecificKey = async (req, res) => {
  const deleteKey = req.params.key;
  try {
    const response = redisClient.del(deleteKey);
    console.log(`Deleted ${deleteKey} key`);
    return res
      .status(200)
      .json({ message: `Deleted ${deleteKey} key`, response });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ error: err.message });
  }
};
export const deleteAllKeys = async () => {
  try {
    const keys = await redisClient.keys("*");
    for (const key of keys) {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error("Failed to delete Redis keys", error);
  }
};

export default redisListener;
