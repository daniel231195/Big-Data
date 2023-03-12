const Kafka = require("node-rdkafka");
const kafkaConf = require("../config/kafka.config");
require("dotenv").config();

const orderTopic = process.env.KAFKA_ORDER_TOPIC;
const deliveredTopic = process.env.KAFKA_DELIVERED_TOPIC;
const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer
  .on("ready", function () {
    console.log("Mongo Consumer ready");
    consumer.subscribe([orderTopic, deliveredTopic]);
    consumer.consume();
  })
  .on("disconnected", (arg) => {
    console.log("Consumer ${arg} disconnected.");
    consumer.connect();
  })
  .on("event.error", (err) => {
    console.log("Error from consumer:", err.message);
    consumer.disconnect();
  })
  .connect();

module.exports = consumer;
