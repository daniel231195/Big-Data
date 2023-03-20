const Kafka = require("node-rdkafka");
const kafkaConf = require("../config/kafka.config");

const orderTopic = process.env.KAFKA_ORDER_TOPIC;
const deliveredTopic = process.env.KAFKA_DELIVERED_TOPIC;
const eventTopic = process.env.KAFKA_EVENT_TOPIC;

const elasticConsumer = new Kafka.KafkaConsumer(kafkaConf.kafkaConfigElastic);
const redisConsumer = new Kafka.KafkaConsumer(kafkaConf.kafkaConfigRedis);

elasticConsumer
  .on("ready", function () {
    console.log("Elastic Consumer ready");
    elasticConsumer.subscribe([orderTopic, deliveredTopic]);
    elasticConsumer.consume();
  })
  .on("disconnected", (arg) => {
    console.log("Elastic consumer ${arg} disconnected.");
    elasticConsumer.connect();
  })
  .on("event.error", (err) => {
    console.log("Error from elastic consumer:", err.message);
    elasticConsumer.disconnect();
  })
  .connect();

redisConsumer
  .on("ready", function () {
    console.log("Redis consumer ready");
    redisConsumer.subscribe([orderTopic, deliveredTopic, eventTopic]);
    redisConsumer.consume();
  })
  .on("disconnected", (arg) => {
    console.log("Redis consumer ${arg} disconnected.");
    elasticConsumer.connect();
  })
  .on("event.error", (err) => {
    console.log("Error from redis consumer:", err.message);
    elasticConsumer.disconnect();
  })
  .connect();

module.exports = { elasticConsumer, redisConsumer };
