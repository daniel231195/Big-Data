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
    topics: "fflvkrwz-orders",
    "key.ignore": "true",
    "schema.ignore": "true",
    "connection.url": "http://localhost:9200",
    "type.name": "_doc",
    name: "elasticsearch-sink",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    transforms: "insertTS,formatTS",
    "transforms.insertTS.type":
      "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.insertTS.timestamp.field": "messageTS",
    "transforms.formatTS.type":
      "org.apache.kafka.connect.transforms.TimestampConverter$Value",
    "transforms.formatTS.format": "yyyy-MM-dd'T'HH:mm:ss",
    "transforms.formatTS.field": "messageTS",
    "transforms.formatTS.target.type": "string",
  },
});
const data2 = JSON.stringify({
  name: "elasticsearch-sink",
  config: {
    "connector.class":
      "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "tasks.max": "1",
    topics: "fflvkrwz-orders",
    "key.ignore": "true",
    "schema.ignore": "true",
    "connection.url": "http://localhost:9200",
    "type.name": "_doc",
    name: "elasticsearch-sink",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    transforms: "insertTS,formatTS",
    "transforms.insertTS.type":
      "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.insertTS.timestamp.field": "messageTS",
    "transforms.formatTS.type":
      "org.apache.kafka.connect.transforms.TimestampConverter$Value",
    "transforms.formatTS.format": "yyyy-MM-dd'T'HH:mm:ss",
    "transforms.formatTS.field": "messageTS",
    "transforms.formatTS.target.type": "string",
  },
});
sds


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
