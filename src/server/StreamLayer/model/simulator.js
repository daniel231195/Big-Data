const producer = require("./kafka.js");
const pizzaInformation = require("./PizzaInformation.js");
require("dotenv").config();

const pizzaBranches = pizzaInformation.pizzaBranches;
const pizzaToppings = pizzaInformation.pizzaTopping;

let minTime;
let maxTime;

let generateOrders = true;

function stopGeneratingOrders() {
  generateOrders = false;
}
function startGeneratingOrders() {
  generateOrders = true;
}

function reverse(s) {
  return [...s].reverse().join("");
}

function addToping() {
  let topping = [];
  let toppingAmount = Math.floor(Math.random() * 5); // 0-4 topping for each pizza
  let i = 0;
  while (topping.length < toppingAmount) {
    let randomIndexToppings = Math.floor(Math.random() * pizzaToppings.length);
    const newTopping = pizzaToppings[randomIndexToppings];
    if (topping.indexOf(newTopping) == -1) {
      topping.push(newTopping);
      i++;
    }
  }
  return topping;
}

function currentHour() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var myTime = ("0000" + (hours * 100 + minutes)).slice(-4);
  return myTime.substring(0, 2) + ":" + myTime.substring(2, myTime.length);
}

function formatDate(date, format) {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yyyy: date.getFullYear(),
  };
  return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
}

function generateOrder(orderCount) {
  let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
  return {
    order_id: orderCount,
    branch_id: pizzaBranches[randomIndexBranches].branch_id,
    branch_name: reverse(pizzaBranches[randomIndexBranches].branch_name),
    district: reverse(pizzaBranches[randomIndexBranches].district),
    order_status: "pending",
    order_date: formatDate(new Date(), "dd/mm/yyyy"),
    order_time: currentHour(),
    order_served_time: "",
    toppings: addToping(),
    branch_open: pizzaBranches[randomIndexBranches].openTime,
    branch_close: pizzaBranches[randomIndexBranches].closeTime,
    topic: "order",
  };
}
function orderDelivered(orderId) {
  const delivered = {
    order_id: orderId,
    served_time: currentHour(),
    topic: "delivered",
  };
  console.log(delivered);
  producer.delivered(delivered);
}

function generateRandomTime(min, max) {
  minTime = min * 60 * 1000; // 5 minutes in milliseconds
  maxTime = max * 60 * 1000; // 50 minutes in milliseconds
  return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
}
function isBranchOpen(branchId) {
  jsonBranch = pizzaBranches.find((t) => t.branch_id === branchId);
  return jsonBranch.branchOpen === "Open";
}
function findMyBranch(branchId) {
  const index = pizzaBranches.findIndex((t) => t.branch_id === branchId);
  return index;
}
function updateBranch(branchEvent, index) {
  pizzaBranches[index].branchOpen = branchEvent.branch_event;
}

function intervalFunction(i, callback) {
  let order = null;
  let deliveryDelay = maxTime;
  if (generateOrders === true) {
    order = generateOrder(i);
    if (isBranchOpen(order.branch_id)) {
      console.log(`Order ${order.order_id} is being prepared`);
      producer.publish(order);
      deliveryDelay = generateRandomTime(5, 50); // random delay between 5 to 50 minutes in milliseconds
    }
  }
  setTimeout(() => {
    if (order !== null) {
      console.log(`Order ${order.order_id} has been delivered`);
      callback(order.order_id);
    }
  }, deliveryDelay);
  branchEvent = generateBranchEvent();
  let index = findMyBranch(branchEvent.branch_id);
  if (pizzaBranches[index].branchOpen !== branchEvent.branch_event) {
    updateBranch(branchEvent, index);
    producer.event(branchEvent);
  }
}

function generateBranchEvent() {
  let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
  let randomEvent = Math.random(0, 1) > 0.2 ? "Open" : "Close";
  return {
    branch_id: pizzaBranches[randomIndexBranches].branch_id,
    branch_event: randomEvent,
    topic: "event",
  };
}

module.exports = {
  generateBranchEvent,
  generateOrder,
  intervalFunction,
  orderDelivered,
  startGeneratingOrders,
  stopGeneratingOrders,
};
