const mongoose = require("mongoose");
const Kafka = require("node-rdkafka");
const orderModel = require("./Order");

require("../database");

const kafkaConf = {
  "group.id": "fflvkrwz-group2",
  "metadata.broker.list":
    "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(
      ","
    ),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "fflvkrwz",
  "sasl.password": "KRnzrdT8Z0BPK-dro1pbuasg4JtGlVQk",
  debug: "generic,broker,security",
};

const orderTopic = "fflvkrwz-orders";
const deliveredTopic = "fflvkrwz-delivered";

const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer.on("ready", function () {
  console.log("Consumer ready");
  consumer.subscribe([orderTopic, deliveredTopic]);
  consumer.consume();
});

// consumer listener for kafka events of pizza transactions
consumer.on("data", function (data) {
  const message = JSON.parse(data.value.toString());
  if (message.topic === "order") {
    let pizzaOrder = new orderModel({
      order_id: message.order_id,
      branch_id: message.branch_id,
      branch_name: message.branch_name,
      district: message.district,
      order_status: message.order_status,
      order_date: message.order_date,
      order_time: message.order_time,
      order_served_time: message.order_served_time,
      toppings: message.toppings,
      branch_open: message.branch_open,
      branch_close: message.branch_close,
      topic: message.topic,
    });
    pizzaOrder
      .save()
      .then((doc) => {
        console.log(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (message.topic === "delivered") {
    markOrderAsReady(message.order_id, message.served_time);
  }
});

consumer.connect();

async function markOrderAsReady(orderId, servedTime) {
  try {
    console.log(servedTime);
    const result = await orderModel.updateOne(
      { order_id: orderId },
      { $set: { order_status: "delivered", order_served_time: servedTime } }
    );
    console.log(`Order with id ${orderId} has been updated. Result: ${result}`);
  } catch (error) {
    console.error(`Error updating order with id ${orderId}: ${error}`);
  }
}
