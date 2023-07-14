import Kafka from "node-rdkafka";
import redisKafkaConfig from "../config/redisKafkaConfig.js";
import {
  deliveredTopic,
  endSimulationTopic,
  eventTopic,
  orderTopic,
} from "./producer.js";

export const redisConsumer = new Kafka.KafkaConsumer(redisKafkaConfig);

redisConsumer
  .on("ready", () => {
    console.log("Redis Consumer ready");
    redisConsumer.subscribe([
      orderTopic,
      deliveredTopic,
      eventTopic,
      endSimulationTopic,
    ]);
    redisConsumer.consume();
  })
  .on("disconnected", (arg) => {
    console.log(`Redis consumer ${arg} disconnected.`);
    redisConsumer.connect();
  })
  .on("event.error", (err) => {
    console.log("Error from redis consumer:", err.message);
    redisConsumer.disconnect();
  })
  .connect();

export default redisConsumer;
