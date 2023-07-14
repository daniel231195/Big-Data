import { elasticClient } from "../config/elasticConnection.js";
import Order from "../models/Order.js";
import { pizzaBranches } from "../simulation/dataGenerator.js";

const spoofedData = async (hits) => {
  const orders = hits.map((element) => element._source);
  return orders;
};
export const getOrders = async (req, res) => {
  try {
    //sort should look like this :  {"field": "orderId", "sort": "desc"}

    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};
    const orders = await Order.find({
      $or: [
        { orderId: { $regex: new RegExp(search, "i") } },
        { branchName: { $regex: new RegExp(search, "i") } },
        { orderStatus: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    const total = await Order.countDocuments({});
    // formatted sort should look like {userId: -1}
    res.status(200).json({ orders, total });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getSearch = async (req, res) => {
  try {
    const { branchId, branchDate } = req.query;
    let date = JSON.parse(branchDate);
    date = date.searchDay + "/" + date.searchMonth + "/" + date.searchYear;
    console.log(date);
    const body = await elasticClient.search({
      index: "order",
      size: 100,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  branchId: branchId,
                },
              },
              {
                match_phrase: {
                  orderDate: date,
                },
              },
            ],
          },
        },
      },
    });

    const orders = await spoofedData(body.hits.hits);
    console.log(orders);
    return res
      .status(200)
      .json({ orders: orders, total: body.hits.total.value });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
export const getBranches = (req, res) => {
  try {
    const branches = pizzaBranches.map((element) => ({
      id: element.branchId,
      title: element.branchName,
    }));
    console.log(branches);
    res.status(200).json({ branches });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
