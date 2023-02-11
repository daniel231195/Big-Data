const Kafka = require("node-rdkafka");

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

consumer.on("data", function (data) {
  console.log(data.value.toString());
});

consumer.on("error", function (error) {
  console.error(error);
});
consumer.connect();
