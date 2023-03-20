const fs = require("fs");

function deltaTime(startTime, endTime) {
  startTime = parseInt(startTime.replace(":", ""));
  endTime = parseInt(endTime.replace(":", ""));

  minDiff = parseInt((endTime % 100) + (60 - (startTime % 100)));
  return minDiff >= 60 ? minDiff - 60 : minDiff;
}
const processData = (newOrder, ordersData) => {
  ordersData.total_orders++;
  ordersData = processTotalOpenOrders(newOrder, ordersData);
  ordersData = averageTreatmentTime(newOrder, ordersData);
  ordersData = ordersByDistricts(newOrder, ordersData);
  ordersData = branchesTreatmentsByTime(newOrder, ordersData);
  ordersData = openBranches(newOrder, ordersData);
  ordersData = toppingProcess(newOrder, ordersData);
  return ordersData;
};

const toppingProcess = (newOrder, ordersData) => {
  if (newOrder.topic === "order") {
    for (topping of newOrder.toppings) {
      ordersData.topping_amount[topping]++;
    }
  }
  return ordersData;
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
    const content = `Branch: ${newOrder.branch_name}, Total Time: ${
      ordersData.total_time_per_branch[newOrder.branch_name]
    }, Total orders: ${
      ordersData.orders_amount_by_branch[newOrder.branch_name]
    }, Average Time: ${
      ordersData.carry_time_per_branch[newOrder.branch_name]
    }\n`;
    fs.writeFile("logs.txt", content, { flag: "a+" }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  ordersData = top5CarryBranchesProcess(ordersData);
  return ordersData;
};

module.exports = {
  processData,
};
