import { v4 as uuidv4 } from "uuid";
import Kafka from "node-rdkafka";
import kafkaConf from "../config/mongoKafkaConfig.js";
import dotenv from "dotenv";
dotenv.config();

export const orderTopic = process.env.KAFKA_ORDER_TOPIC;
export const deliveredTopic = process.env.KAFKA_DELIVERED_TOPIC;
export const eventTopic = process.env.KAFKA_EVENT_TOPIC;
export const endSimulationTopic = process.env.KAFKA_SIMULATION_TOPIC;

export const producer = new Kafka.Producer(kafkaConf);
let i = 0;
const genMessage = (m) => {
  const stringAsUTF8 = Buffer.from(m, "utf8");
  return Buffer.alloc(stringAsUTF8.length, stringAsUTF8);
};

var is_ready = false;
producer.on("ready", (arg) => {
  is_ready = true;
});
producer.connect();

export const publish = (msg) => {
  if (!is_ready) return -1;
  const m = JSON.stringify(msg);
  producer.produce(orderTopic, -1, genMessage(m), uuidv4());
  console.log("produced order message:", i++);
};
export const delivered = (msg) => {
  if (!is_ready) return -1;
  const m = JSON.stringify(msg);
  producer.produce(deliveredTopic, -1, genMessage(m), uuidv4());
};
export const event = (msg) => {
  if (!is_ready) return -1;
  const m = JSON.stringify(msg);
  producer.produce(eventTopic, -1, genMessage(m), uuidv4());
};

export const simulation = (msg) => {
  if (!is_ready) return -1;
  console.log("send simulation stop event");
  const m = JSON.stringify(msg);
  producer.produce(endSimulationTopic, -1, genMessage(m), uuidv4());
};
