import { elasticClient } from "../config/elasticConnection.js";
import { elasticConsumer } from "../kafka/elasticConsumer.js";

export const elasticListener = () => {
  elasticConsumer.on("data", async function (data) {
    const message = JSON.parse(data.value);
    if (message.topic === "order") {
      try {
        await elasticClient.index({
          index: "order",
          id: message.orderId.toString(),
          body: {
            ...message,
          },
        });
        console.log(
          `Uploading to Elasticsearch ${message.orderId}  order topics`
        );
      } catch (error) {
        console.error(
          `Error uploading to Elasticsearch order topics, ${error}`
        );
      }
    }
    if (message.topic === "delivered") {
      try {
        const body = await elasticClient.update({
          index: "order",
          id: message.orderId,
          body: {
            doc: {
              orderStatus: message.topic,
              orderServedTime: message.servedTime,
            },
          },
        });
        console.log(
          `Order with id ${message.orderId} has been updated. Result: ${body}`
        );
      } catch (error) {
        console.error(
          `Error updating order with id ${message.orderId}: ${error}`
        );
      }
    }
  });
};
export async function deleteElasticCollections() {
  try {
    elasticClient.indices.delete({
      index: "order",
    });
  } catch (error) {
    console.log("Error with delete all the elastic indices: ", error);
  }
}
