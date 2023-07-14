import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
  node: "http://localhost:9200",
  host: "[elasticsearch://9200]",
  maxRetries: 5,
  requestTimeout: 60000,
});
elasticClient.indices
  .exists({
    index: "order",
  })
  .then(async (exists) => {
    if (!exists) {
      console.log(`Creating index order`);
      return elasticClient.indices
        .create({
          index: "order",
        })
        .then((r) => {
          console.log(`Index order created ${r}`);
        });
    } else {
      console.log(`Index order exists`);
      return Promise.resolve();
    }
  })
  .catch((err) => {
    console.log(`Unbale to create index order ...`, err);
    return Promise.reject(err);
  });
