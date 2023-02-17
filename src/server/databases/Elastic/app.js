const https = require("http");

const url = "http://localhost:8083/connectors";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const data = JSON.stringify({
  name: "elasticsearch-sink",
  config: {
    "connector.class":
      "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "tasks.max": "1",
    topics: "my-kafka-topic",
    "key.ignore": "true",
    "connection.url": "http://localhost:9200",
    "type.name": "_doc",
    "schema.ignore": "true",
    transforms: "extractTimestamp",
    "transforms.extractTimestamp.type":
      "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.extractTimestamp.timestamp.field": "timestamp",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "bootstrap.servers": "glider.srvs.cloudkafka.com:9094",
    "security.protocol": "SASL_SSL",
    "sasl.username": "fflvkrwz",
    "sasl.password": "KRnzrdT8Z0BPK-dro1pbuasg4JtGlVQk",
    "sasl.mechanism": "SCRAM-SHA-256",
    "sasl.jaas.config":
      'org.apache.kafka.common.security.scram.ScramLoginModule required username="your-username" password="your-password";',
  },
});

const req = https.request(url, options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
