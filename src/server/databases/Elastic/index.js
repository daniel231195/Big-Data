require("dotenv").config({ path: `${__dirname}/../../../../.env` });
const client = require("./model/connect.js");
const kafkaConsumer = require("./model/Kafka");

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
      console.log("Uploading to Elasticsearch order topics");
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
