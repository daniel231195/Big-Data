const connect = require("../model/connect");
const client = connect.elasticClient;

/**
 * @deletion method for deleting specific topics from elasticsearch host.
 * example: http://localhost:3000/topic/<existing topic>
 * @param {indexName}
 */
const deleteIndex = async (req, res) => {
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
};
/**
 * @GET method for searching particular an order ID from particular index using routs
 * example: http://localhost:3000/search/<EXISTING-INDEX>/<EXISITNG-ID>
 */
const searchIndexId = async (req, res) => {
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
};
const searchAll = async (req, res) => {
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
};
/**
 * @GET method use to search for records from particular branch and in particular date.
 * Example for a request localhost:3002/search/<branch_id>/<day>/<month>/<year>
 * Return valid records from this dates and branch
 */
const searchBranchIdDate = async (req, res) => {
  try {
    const { branchId, searchDay, searchMonth, searchYear } = req.params;
    const body = await client.search({
      index: "order",
      size: 100,
      body: {
        query: {
          bool: {
            must: [
              { match: { branch_id: branchId } },
              {
                match: {
                  order_date: searchDay + "/" + searchMonth + "/" + searchYear,
                },
              },
            ],
          },
        },
      },
    });
    return res.json({ data: body });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
module.exports = {
  deleteIndex,
  searchIndexId,
  searchBranchIdDate,
  searchAll,
};
