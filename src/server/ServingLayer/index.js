/**
 * All require
 */
require("dotenv").config({ path: `${__dirname}/../../../.env` });
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const batchController = require("./controller/batch.controller");
const streamController = require("./controller/stream.controller");
const elasticController = require("./controller/elastic.controller");
const kafkaConsumer = require("./model/Kafka");
const client = require("./model/connect");

/**
 * Connection
 */

/**
 * All Middlewares
 */
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * All Routes
 */
app
  .get("/", (req, res) => res.send("Hello World!"))
  .get("/batch/getModelInfo", batchController.getModelInfo)
  .get("/batch/getDataSetInfo", batchController.getDataSet);
//     .get("/stream", )
/**
 * @deletion method for deleting specific topics from elasticsearch host.
 * example: http://localhost:3000/es/<existing topic>
 * @param {indexName}
 */
app
  .delete("/es/:indexName", elasticController.deleteIndex)
  /**
   * @GET method for searching particular an order ID from particular index using routs
   * example: http://localhost:3000/search/<EXISTING-INDEX>/<EXISITNG-ID>
   */
  .get("/es/:indexName/:id", elasticController.searchIndexId)
  .get("/es/all", elasticController.searchAll)
  /**
   * @GET method use to search for records from particular branch and in particular date.
   * Example for a request localhost:3000/es/<branch_id>/<day>/<month>/<year>
   * Return valid records from this dates and branch
   */
  .get(
    "/es/:branchId/:searchDay/:searchMonth/:searchYear",
    elasticController.searchBranchIdDate
  );

kafkaConsumer.on("data", async function (data) {
  const message = JSON.parse(data.value.toString());
  if (message.topic === "order") {
    const order = {
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
    };
    try {
      await client.index({
        index: "order",
        id: message.order_id.toString(),
        body: {
          ...order,
        },
      });
      console.log(
        `Uploading to Elasticsearch ${message.order_id}  order topics`
      );
    } catch (error) {
      console.error(`Error uploading to Elasticsearch order topics, ${error}`);
    }
  }
  if (message.topic === "delivered") {
    try {
      const body = await client.update({
        index: "order",
        id: message.order_id,
        body: {
          doc: {
            order_status: message.topic,
            order_served_time: message.served_time,
          },
        },
      });
      console.log(
        `Order with id ${message.order_id} has been updated. Result: ${body}`
      );
    } catch (error) {
      console.error(
        `Error updating order with id ${message.order_id}: ${error}`
      );
    }
  }
});
/**
 * Start Server on port 3001
 * @type {string|number}
 */
const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => console.log("server run on port %d", port));
