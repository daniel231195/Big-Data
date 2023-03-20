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
const redisController = require("./controller/redis.controller");
const kafkaConsumer = require("./model/Kafka");
const client = require("./model/connect");
const orderProcess = require("./model/orderProcess");

const elasticClient = client.elasticClient;
const redisClient = client.redisClient;

const port = process.env.PORT || 3002;

const server = http.createServer(app);

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
  .get("/batch/getAssociation", batchController.getAssociation)
  .get("/api/getAllOrders", redisController.getAllOrders)
  .delete("/api/deleteKey/:key", redisController.deleteSpecificKey)
  //     .get("/stream", )
  /**
   * @deletion method for deleting specific topics from elasticsearch host.
   * example: http://localhost:3001/es/<existing topic>
   * @param {indexName}
   */

  .delete("/es/delete/:indexName", elasticController.deleteIndex)
  /**
   * @GET method for searching particular an order ID from particular index using routs
   * example: http://localhost:3001/search/<EXISTING-INDEX>/<EXISITNG-ID>
   */
  .get("/es/:indexName/:id", elasticController.searchIndexId)
  .get("/es/all", elasticController.searchAll)
  /**
   * @GET method use to search for records from particular branch and in particular date.
   * Example for a request localhost:3001/es/<branch_id>/<day>/<month>/<year>
   * Return valid records from this dates and branch
   */
  .get(
    "/es/:branchId/:searchDay/:searchMonth/:searchYear",
    elasticController.searchBranchIdDate
  );

// function packOrder(message) {
//   const order = {
//     order_id: message.order_id,
//     branch_id: message.branch_id,
//     branch_name: message.branch_name,
//     district: message.district,
//     order_status: message.order_status,
//     order_date: message.order_date,
//     order_time: message.order_time,
//     order_served_time: message.order_served_time,
//     toppings: message.toppings,
//     branch_open: message.branch_open,
//     branch_close: message.branch_close,
//     topic: message.topic,
//   };
//   return order;
// }

kafkaConsumer.elasticConsumer.on("data", async function (data) {
  const message = JSON.parse(data.value);
  if (message.topic === "order") {
    try {
      await elasticClient.index({
        index: "order",
        id: message.order_id.toString(),
        body: {
          ...message,
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
      const body = await elasticClient.update({
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

kafkaConsumer.redisConsumer.on("data", async function (data) {
  const newOrder = JSON.parse(data.value);
  // console.log(newOrder);
  try {
    let ordersData = await redisClient.json.get("orders_data");
    if (newOrder.topic === "order") {
      ordersData = orderProcess.processData(newOrder, ordersData);
      await redisClient.json.arrInsert("All_orders", ".", 0, newOrder);
      console.log(`Insert new order ${newOrder.order_id} to redis`);
    }
    if (newOrder.topic === "delivered") {
      const allOrders = await redisClient.json.get("All_orders");
      const index = await allOrders.findIndex(
        (order) => order.order_id === newOrder.order_id
      );
      if (index > -1) {
        await redisClient.json.set(
          "All_orders",
          `.[${index}].order_status`,
          newOrder.topic
        );
        await redisClient.json.set(
          "All_orders",
          `.[${index}].order_served_time`,
          newOrder.served_time
        );
        let delivered = await redisClient.json.get("All_orders", `.[${index}]`);
        if (delivered) {
          // console.log(delivered[index]);
          ordersData = orderProcess.processData(delivered[index], ordersData);
          console.log(`Updated delivered order ${delivered[index].order_id}`);
        }
      }
    }
    if (newOrder.topic === "event") {
      console.log(`Branch event process ${newOrder}`);
      ordersData = orderProcess.processData(newOrder, ordersData);
    }
    // console.log(ordersData.carry_time_per_branch);
    await redisClient.json.set("orders_data", ".", ordersData);
  } catch (error) {
    console.log("Redis insert error:", error.message);
  }
});
/**
 * Start Server on port 3002
 */

server.listen(port, () =>
  console.log("Serving Layer started at http://localhost:%d", port)
);
