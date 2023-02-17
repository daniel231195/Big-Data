const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const kafkaConf = require("../config/kafka.config");
require("dotenv").config();

const orderTopic = process.env.KAFKA_ORDER_TOPIC;
const deliveredTopic = process.env.KAFKA_DELIVERED_TOPIC;

console.log(orderTopic);
const producer = new Kafka.Producer(kafkaConf);

const genMessage = (m) => {
  const stringAsUTF8 = Buffer.from(m, "utf8");
  return Buffer.alloc(stringAsUTF8.length, stringAsUTF8);
};

var is_ready = false;
producer.on("ready", function (arg) {
  is_ready = true;
});
producer.connect();

const publish = function (msg) {
  if (!is_ready) {
    return -1;
  }
  m = JSON.stringify(msg);
  producer.produce(orderTopic, -1, genMessage(m), uuid.v4());
};
const delivered = function (msg) {
  if (!is_ready) {
    return -1;
  }
  m = JSON.stringify(msg);
  producer.produce(deliveredTopic, -1, genMessage(m), uuid.v4());
};
module.exports = {
  publish,
  delivered,
};
