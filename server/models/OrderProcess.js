import moment from "moment/moment.js";
import redisClient from "../config/redisConnection.js";
import { deliveredProcess } from "../controllers/dashboard.js";

let i = 0;
const DELIVERED_TOPIC = "delivered";
const deltaTime = (startTime, endTime) => {
  console.log(`Start Time: ${startTime}, End Time: ${endTime}`);
  startTime = parseInt(startTime.replace(":", ""));
  endTime = parseInt(endTime.replace(":", ""));

  const minDiff = parseInt((endTime % 100) + (60 - (startTime % 100)));
  return minDiff >= 60 ? minDiff - 60 : minDiff;
};

export const getAllOrdersArray = async () => {
  return await redisClient.json.get("allOrders");
};
export const getOrdersDataArray = async () => {
  return await redisClient.json.get("ordersData");
};

export const getIndexByOrderId = async (allOrders, orderId) => {
  const index = await allOrders.findIndex((order) => order.orderId === orderId);
  return index;
};

export const processData = async (newOrder, ordersData, allOrders) => {
  await addOrderToAllOrdersArray(newOrder, allOrders);
  await ordersCounter(ordersData);
  await toppingProcess(newOrder, ordersData);
  await ordersByDistrictsCounter(newOrder, ordersData);
  await ordersByBranchesCounter(newOrder, ordersData);
  await ordersPer2Hours(newOrder, ordersData);
};

export const handleDelivered = async (newOrder, ordersData, allOrders) => {
  const index = await getIndexByOrderId(allOrders, newOrder.orderId);
  const order = await allOrders[index];
  if (order) {
    await ordersDeliveredCounter(order, ordersData, newOrder.servedTime);
    await ordersDeliveredByBranches(order, ordersData);
    await averageTreatmentTime(order, ordersData);
    await branchesTotalTreatmentTime(order, ordersData);
    await averageTimePerBranch(order, ordersData);
    await top5CarryBranchesProcess(ordersData);
  }
};

export const handleEvent = async (order, ordersData) => {
  await openBranches(order, ordersData);
};

export const updateOrdersDataArray = async (ordersData, multi) => {
  await multi.json.set("ordersData", ".", ordersData);
};

export const updateAllOrdersArray = async (allOrders, multi) => {
  await multi.json.set("allOrders", ".", allOrders);
};
const addOrderToAllOrdersArray = async (newOrder, allOrders) => {
  allOrders.unshift(newOrder);
};
const ordersCounter = async (ordersData) => {
  ordersData.totalOpenOrders++;
  ordersData.totalOrders++;
};

const ordersDeliveredCounter = async (newOrder, ordersData, servedTime) => {
  ordersData.totalOpenOrders--;
  ordersData.totalCompletedOrders++;
  newOrder.orderStatus = DELIVERED_TOPIC;
  newOrder.orderServedTime = servedTime;
};

const ordersDeliveredByBranches = async (newOrder, ordersData) => {
  const branch = newOrder.branchName;
  if (!ordersData.deliveredOrdersByBranch[branch]) {
    ordersData.deliveredOrdersByBranch[branch] = 0;
  }
  ordersData.deliveredOrdersByBranch[branch]++;
};

const toppingProcess = async (newOrder, ordersData) => {
  for (const topping of newOrder.toppings) {
    ordersData.toppingAmount[topping]++;
  }
  i++;
  if (i % 20 === 0) {
    top5ToppingProcess(ordersData);
  }
};
const ordersByBranchesCounter = async (newOrder, ordersData) => {
  const branch = newOrder.branchName;
  if (!ordersData.ordersAmountByBranch[branch]) {
    ordersData.ordersAmountByBranch[branch] = 0;
  }
  ordersData.ordersAmountByBranch[branch]++;
};

const ordersByDistrictsCounter = async (newOrder, ordersData) => {
  const district = newOrder.district;
  if (!ordersData.ordersByDistricts[district]) {
    ordersData.ordersByDistricts[district];
  }
  ordersData.ordersByDistricts[district]++;
};
const averageTimePerBranch = async (newOrder, ordersData) => {
  const branch = newOrder.branchName;
  if (!ordersData.carryTimePerBranch[branch])
    ordersData.carryTimePerBranch[branch] = 0;
  ordersData.carryTimePerBranch[branch] =
    ordersData.totalTimePerBranch[branch] /
    ordersData.deliveredOrdersByBranch[branch];
};

const top5ToppingProcess = async (orderData) => {
  try {
    const sortedJson = Object.entries(orderData.toppingAmount)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const res = sortedJson;
    orderData.top5Topping = Object.entries(res)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  } catch (err) {
    console.log("Top5ToppingProcess Function failed: ", err);
  }
};
const top5CarryBranchesProcess = async (ordersData) => {
  try {
    const sortedJson = Object.entries(ordersData.carryTimePerBranch)
      .sort(([, a], [, b]) => a - b)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const res = sortedJson;
    ordersData.top5CarryBranches = Object.entries(res)
      .filter(([key, value]) => value > 0)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  } catch (err) {
    console.log("Top5CarryBranchesProcess Function failed: ", err);
  }
};
const changeKeysToHebrew = (ordersData) => {
  const pizzaToppingMap = {
    onion: "לצב",
    olives: "םיתיז",
    tomato: "תוינבגע",
    corn: "סרית",
    mushrooms: "תוירטפ",
  };
  const updatedToppings = {};
  for (const [key, value] of Object.entries(ordersData.top5Topping)) {
    const translatedKey = pizzaToppingMap[key] || key; // use the translation map or keep the original key
    updatedToppings[translatedKey] = value; // update the key in the new object
  }
  ordersData.top5Topping = updatedToppings;
  return ordersData;
};

export const openBranches = async (newOrder, ordersData) => {
  try {
    if (newOrder.branchEvent === "Close") {
      ordersData.openBranches--;
    } else {
      ordersData.openBranches++;
    }
  } catch (err) {
    console.log(`Open branches problem: ${err}`);
  }
};
const averageTreatmentTime = async (newOrder, ordersData) => {
  let timeDiff;
  timeDiff = deltaTime(
    newOrder.orderTime.toString(),
    newOrder.orderServedTime.toString()
  );
  ordersData.totalDeliveredTime += timeDiff;

  ordersData.averageDeliveredTime =
    ordersData.totalDeliveredTime / ordersData.totalCompletedOrders;
};

const ordersPer2Hours = async (newOrder, orderData) => {
  // Iterate over time ranges
  for (const range in orderData.timeRanges) {
    // Get start and end times
    const [start, end] = range.split(" - ");

    // Convert start and end times to moment objects
    const startTime = moment(start, "HH:mm");
    const endTime = moment(end, "HH:mm");

    // Convert input time to moment object
    const inputMoment = moment(newOrder.orderTime, "HH:mm");

    // Check if input time is between start and end times
    if (inputMoment.isBetween(startTime, endTime)) {
      // Increment value for matching time range
      orderData.timeRanges[range]++;
      break; // Stop iterating over time ranges
    }
  }
};

const branchesTotalTreatmentTime = async (newOrder, ordersData) => {
  let timeDiff;
  const branch = newOrder.branchName;
  timeDiff = deltaTime(
    newOrder.orderTime.toString(),
    newOrder.orderServedTime.toString()
  );
  if (!ordersData.totalTimePerBranch[branch]) {
    ordersData.totalTimePerBranch[branch] = 0;
  }
  ordersData.totalTimePerBranch[branch] += timeDiff;
};
// ordersData = top5CarryBranchesProcess(ordersData);

export default processData;
