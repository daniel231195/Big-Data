const { Client } = require("@elastic/elasticsearch");
const redis = require("redis");

const elasticClient = new Client({
  node: "http://localhost:9200",
  host: "[elasticsearch://9200]",
  maxRetries: 5,
  requestTimeout: 60000,
});
elasticClient.indices
  .exists({
    index: "order",
  })
  .then(async (exists) => {
    if (!exists) {
      console.log(`Creating index order`);
      return elasticClient.indices
        .create({
          index: "order",
        })
        .then((r) => {
          console.log(`Index order created ${r}`);
        });
    } else {
      console.log(`Index order exists`);
      return Promise.resolve();
    }
  })
  .catch((err) => {
    console.log(`Unbale to create index order ...`, err);
    return Promise.reject(err);
  });
const redisClient = redis.createClient({
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
  const allOrders = await redisClient.exists("All_orders");
  const ordersData = await redisClient.exists("orders_data");
  if (allOrders && ordersData) {
    console.log(await redisClient.json.GET("orders_data"));
  } else {
    await redisClient.json.set("orders_data", ".", require("./dashboard.js"));
    await redisClient.json.set("All_orders", ".", []);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    redisClient.EXPIREAT("calls_data", parseInt(todayEnd / 1000));
    redisClient.EXPIREAT("All_calls", parseInt(todayEnd / 1000));
    console.log("Creating:", await redisClient.json.GET("orders_data"));
    console.log("Creating:", await redisClient.json.GET("All_orders"));
  }
})();

module.exports = { elasticClient, redisClient };
