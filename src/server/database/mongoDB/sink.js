const mongoose = require("mongoose");
const Kafka = require("node-rdkafka");
const database = require("../database");

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

const topic = "fflvkrwz-orders";

const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer.on("ready", function () {
  console.log("Consumer ready");
  consumer.subscribe([topic]);
  consumer.consume();
});

// consumer listener for kafka events of pizza transactions
consumer.on("data", function (data) {
  const message = JSON.parse(data.value.toString());
  let pizzaSchema = require("./Order");
  let pizzaOrder = new pizzaSchema({
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
});

consumer.connect();
