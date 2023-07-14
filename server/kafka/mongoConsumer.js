import Kafka from "node-rdkafka";
import kafkaConf from "../config/mongoKafkaConfig.js";
import dotenv from "dotenv";
dotenv.config();
import { deliveredTopic, orderTopic } from "./producer.js";

export const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer
  .on("ready", function () {
    console.log("Mongo Consumer ready");
    consumer.subscribe([orderTopic, deliveredTopic]);
    consumer.consume();
  })
  .on("disconnected", (arg) => {
    console.log(`Consumer ${arg} disconnected.`);
    consumer.connect();
  })
  .on("event.error", (err) => {
    console.log("Error from consumer:", err.message);
    consumer.disconnect();
  })
  .connect();
