const { Client } = require("@elastic/elasticsearch");
const redis = require("redis");

const elasticClient = new Client({
  node: "http://localhost:9200",
  host: "[elasticsearch://9200]",
  maxRetries: 5,
  requestTimeout: 60000,
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
  redisClient.set('myvalue', 'value');
  const value = await redisClient.get('myvalue');
  console.log(value);
})();

module.exports = { elasticClient, redisClient };
