const fs = require("fs");
const moment = require("moment");
const { delivered } = require("../../StreamLayer/model/kafka");
const { total_orders } = require("./dashboard");

function deltaTime(startTime, endTime) {
  startTime = parseInt(startTime.replace(":", ""));
  endTime = parseInt(endTime.replace(":", ""));

  minDiff = parseInt((endTime % 100) + (60 - (startTime % 100)));
  return minDiff >= 60 ? minDiff - 60 : minDiff;
}
const processData = (newOrder, ordersData) => {
  ordersData = processTotalOpenOrders(newOrder, ordersData);
  ordersData = averageTreatmentTime(newOrder, ordersData);
  ordersData = ordersByDistricts(newOrder, ordersData);
  ordersData = branchesTreatmentsByTime(newOrder, ordersData);
  ordersData = openBranches(newOrder, ordersData);
  ordersData = toppingProcess(newOrder, ordersData);
  ordersData = ordersPer2Hours(newOrder, ordersData);
  return ordersData;
};

const toppingProcess = (newOrder, ordersData) => {
  if (newOrder.topic === "order" && newOrder.status !== "delivered") {
    ordersData.total_orders++;
    for (topping of newOrder.toppings) {
      ordersData.topping_amount[topping]++;
    }
  }
  ordersData = top5ToppingProcess(newOrder, ordersData);
  return ordersData;
};

const top5ToppingProcess = (newOrder, orderData) => {
  if (newOrder.topic === "order" && newOrder.status !== "delivered") {
    try {
      const sortedJson = Object.entries(orderData.topping_amount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      let res = sortedJson;
      orderData.top5Topping = Object.entries(res)
        .slice(0, 5)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
    } catch (err) {
      console.log("Top5ToppingProcess Function failed: ", err);
    }
    return orderData;
  }
};
const top5CarryBranchesProcess = (ordersData) => {
  try {
    const sortedJson = Object.entries(ordersData.carry_time_per_branch)
      .sort(([, a], [, b]) => a - b)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    let res = sortedJson;
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
  return ordersData;
};

const openBranches = (newOrder, ordersData) => {
  if (newOrder.topic === "event") {
    if (newOrder.branch_event === "Close") {
      ordersData.open_branches--;
    } else {
      ordersData.open_branches++;
    }
  }
  return ordersData;
};

const processTotalOpenOrders = (newOrder, ordersData) => {
  if (newOrder.topic === "order" && newOrder.status !== "delivered") {
    ordersData.total_open_orders++;
  }
  return ordersData;
};

const averageTreatmentTime = (newOrder, ordersData) => {
  let timeDiff;
  if (newOrder.topic === "order" && newOrder.order_status === "delivered") {
    ordersData.total_open_orders--;
    ordersData.total_completed_orders++;
    timeDiff = deltaTime(
      newOrder.order_time.toString(),
      newOrder.order_served_time.toString()
    );
    ordersData.total_delivered_time += timeDiff;
    ordersData.average_delivered_time =
      ordersData.total_delivered_time / ordersData.total_completed_orders;
    // console.log(`Time Difference: ${timeDiff}`);
  }
  return ordersData;
};

const ordersPer2Hours = (newOrder, orderData) => {
  if (newOrder.topic === "order" && newOrder.status !== "delivered")
    // Iterate over time ranges
    for (const range in orderData.timeRanges) {
      // Get start and end times
      const [start, end] = range.split(" - ");

      // Convert start and end times to moment objects
      const startTime = moment(start, "HH:mm");
      const endTime = moment(end, "HH:mm");

      // Convert input time to moment object
      const inputMoment = moment(newOrder.order_time, "HH:mm");

      // Check if input time is between start and end times
      if (inputMoment.isBetween(startTime, endTime)) {
        // Increment value for matching time range
        orderData.timeRanges[range]++;
        break; // Stop iterating over time ranges
      }
    }
  return orderData;
};
const ordersByDistricts = (newOrder, ordersData) => {
  if (newOrder.topic === "order" && newOrder.status !== "delivered") {
    ordersData.orders_by_districts[newOrder.district]++;
  }
  return ordersData;
};
const branchesTreatmentsByTime = (newOrder, ordersData) => {
  let timeDiff;
  if (newOrder.topic === "order" && newOrder.order_status === "delivered") {
    timeDiff = deltaTime(
      newOrder.order_time.toString(),
      newOrder.order_served_time.toString()
    );
    ordersData.orders_amount_by_branch[newOrder.branch_name]++;
    ordersData.total_time_per_branch[newOrder.branch_name] += timeDiff;
    ordersData.carry_time_per_branch[newOrder.branch_name] =
      ordersData.total_time_per_branch[newOrder.branch_name] /
      ordersData.orders_amount_by_branch[newOrder.branch_name];
  }
  ordersData = top5CarryBranchesProcess(ordersData);
  return ordersData;
};

module.exports = {
  processData,
};
