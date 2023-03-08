const client = require("./connect.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.json({ data: client });
});
app.post("/", function (req, res) {
  res.json(req.body);
});
/**
 * @deletion method for deleting specific topics from elasticsearch host.
 * example: http://localhost:3000/topic/<existing topic>
 * @param {indexName}
 */
app.delete("/index/:indexName", async function (req, res) {
  const { indexName } = req.params;
  try {
    const response = await client.indices.delete({
      index: indexName,
    });
    return res.json({ message: `Index ${indexName} deleted`, response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
/**
 * @GET method for searching particular an order ID from particular index using routs
 * example: http://localhost:3000/search/<EXISTING-INDEX>/<EXISITNG-ID>
 */
app.get("/search/:indexName/:id", async function (req, res) {
  const { indexName, id } = req.params;
  try {
    const body = await client.search({
      index: indexName,
      body: {
        query: {
          match: { order_id: id },
        },
      },
    });
    return res.json({ data: body });
  } catch (error) {
    console.error(
      `Something went wrong with ID: ${id} search error: ${error.message}`
    );
    return res.json({ error: error.message });
  }
});
app.get("/search", async function (req, res) {
  try {
    const body = await client.search({
      index: "order",
      body: {
        query: {
          match_all: {},
        },
      },
    });
    return res.json({ data: body });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});
app.get(
  "/search/:branchName/:searchDay/:searchMonth/:searchYear",
  async function (req, res) {
    try {
      const { branchName, searchDay, searchMonth, searchYear } = req.params;
      const body = await client.search({
        index: "order",
        body: {
          query: {
            match: {
              doc: {
                branch_name: branchName,
                order_date: searchDay + "/" + searchMonth + "/" + searchYear,
              },
            },
          },
        },
      });
      return res.json({ data: body });
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
