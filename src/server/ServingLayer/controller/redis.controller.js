const clients = require("../model/connect");

const redisClient = clients.redisClient;

async function getAllOrders(req, res) {
  try {
    const allOrders = await redisClient.json.get("All_orders");
    return res.json(allOrders);
  } catch (error) {
    return res.json({ error: error.message });
  }
}
const deleteSpecificKey = async (req, res) => {
  const deleteKey = req.params.key;
  try {
    const response = redisClient.del(deleteKey);
    console.log(`Deleted ${deleteKey} key`);
    return res.json({ message: `Deleted ${deleteKey} key`, response });
  } catch (err) {
    console.log(err.message);
    return res.json({ error: err.message });
  }
};
module.exports = {
  getAllOrders,
  deleteSpecificKey,
};
