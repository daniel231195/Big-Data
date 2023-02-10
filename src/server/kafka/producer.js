const uuid = require("uuid");
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

const prefix = "fflvkrwz-";
const orderTopic = `${prefix}orders`;
const deliveredTopic = `${prefix}delivered`;

const producer = new Kafka.Producer(kafkaConf);

const genMessage = (m) => {
  const stringAsUTF8 = Buffer.from(m, "utf8");
  return Buffer.alloc(stringAsUTF8.length, stringAsUTF8);
};

var is_ready = false;
producer.on("ready", function (arg) {
  console.log(`producer Ariel is ready.`);
  is_ready = true;
});
producer.connect();

var i = 0;
module.exports.publish = function (msg) {
  if (!is_ready) {
    console.log("producer is not ready yet..");
    return -1;
  }
  m = JSON.stringify(msg);
  console.log(m);
  producer.produce(orderTopic, -1, genMessage(m), uuid.v4());
  //producer.disconnect();

  if (i % 100 == 0) console.log("published ", i, "items");
  return ++i;
};
module.exports.delivered = function (msg) {
  m = JSON.stringify(msg);
  console.log(m);
  producer.produce(deliveredTopic, -1, genMessage(m), uuid.v4());
};
