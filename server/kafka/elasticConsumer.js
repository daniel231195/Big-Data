import Kafka from "node-rdkafka";
import kafkaConf from "../config/elasticKafkaConfig.js";

import { deliveredTopic, orderTopic } from "./producer.js";

export const elasticConsumer = new Kafka.KafkaConsumer(kafkaConf);

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
