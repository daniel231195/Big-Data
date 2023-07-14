import redis from "redis";
import { ordersValues } from "../models/dashboard.js";

export const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
redisClient
  .on("error", (err) => {
    console.error("Error " + err.message);
  })
  .on("connect", () => {
    console.log("Receiver connected to Redis");
  });

(async () => {
  await redisClient.connect();
  // RedisJSON uses JSON Path syntax. '.' is the root.
  const allOrders = await redisClient.exists("allOrders");
  const ordersData = await redisClient.exists("ordersData");
  if (allOrders && ordersData) {
    console.log(await redisClient.json.GET("ordersData"));
  } else {
    await redisClient.json.set("ordersData", ".", ordersValues);
    await redisClient.json.set("allOrders", ".", []);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    redisClient.EXPIREAT("ordersData", parseInt(todayEnd / 1000));
    redisClient.EXPIREAT("allOrders", parseInt(todayEnd / 1000));
    console.log("Creating:", await redisClient.json.GET("ordersData"));
    console.log("Creating:", await redisClient.json.GET("allOrders"));
  }
})();
export default redisClient;
