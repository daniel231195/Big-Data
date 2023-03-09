const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: `${__dirname}/../../../.env` });
require("./model/database"); // for connection configurations to mongodb

const kafkaConsumer = require("./model/Kafka");
const OrderModel = require("./model/Order");

const mongoController = require("./controller/mongo.controller");
const bigmlController = require("./controller/bigml.controller");

// const PizzaOrderModel = require("./model/PizzaOrder");

const app = express();

/* Middlewares */
app.use(express.json());
app.use(cors()); 

/* Routes */
app
  .get("/", (req, res) => res.send("Hello World!"))
  .get("/api/getAllOrder", mongoController.getAllOrder)
  .post("/api/insertOrder", mongoController.insertOrder)
  .delete("/api/deleteAllOrders", mongoController.deleteAllOrders)
  .get("/api/jsonFile", bigmlController.makeJsonFile)
  .get("/api/buildModel", bigmlController.buildModel)
  .get("/api/modelInfo", bigmlController.getModelInfo)
  .get("/api/datasetInfo", bigmlController.getDataSetlInfo)
  .post("/api/associationOrder", bigmlController.createAssociation);

async function markOrderAsReady(orderId, servedTime) {
  try {
    console.log(servedTime);
    const result = await OrderModel.updateOne(
      { order_id: orderId },
      { $set: { order_status: "delivered", order_served_time: servedTime } }
    );
    console.log(`Order with id ${orderId} has been updated. Result: ${result}`);
  } catch (error) {
    console.error(`Error updating order with id ${orderId}: ${error}`);
  }
}

kafkaConsumer.on("data", function (data) {
  const message = JSON.parse(data.value.toString());
  if (message.topic === "order") {
    const pizzaOrder = new OrderModel(JSON.parse(data.value));
    pizzaOrder
      .save()
      .then((doc) => {
        console.log(
          "************************ Upload To Mongo ****************************************"
        );
        console.log(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (message.topic === "delivered") {
    markOrderAsReady(message.order_id, message.served_time);
  }
});
/* Start server */
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Batch Layer listening at http://localhost:${PORT}`);
});
