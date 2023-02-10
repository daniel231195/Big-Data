const producer = require("./producer.js");
const pizzaInformation = require("./PizzaInformation.js");

const pizzaBranches = pizzaInformation.pizzaBranches;
const pizzaToppings = pizzaInformation.pizzaTopping;
const openingTime = pizzaInformation.openingTime;
const closingTime = pizzaInformation.closingTime;

const maxOrderInterval = 5000;
const minOrderInterval = 2000;
let orderCount = 1;

function reverse(s) {
  return [...s].reverse().join("");
}

function addToping() {
  let topping = [];
  let toppingAmount = Math.floor(Math.random() * 5); // 0-4 topping for each pizza
  for (let index = 0; index < toppingAmount; index++) {
    let randomIndexToppings = Math.floor(Math.random() * pizzaToppings.length);
    topping.push(reverse(pizzaToppings[randomIndexToppings]));
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

function generateOrder() {
  let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
  let randomOpeningBranches = Math.floor(Math.random() * openingTime.length);
  let randomClosedBranches = Math.floor(Math.random() * closingTime.length);
  return {
    order_id: orderCount,
    branch_id: pizzaBranches[randomIndexBranches].branch_id,
    branch_name: reverse(pizzaBranches[randomIndexBranches].branch_name),
    district: reverse(pizzaBranches[randomIndexBranches].district),
    order_status: "pending",
    order_date: formatDate(new Date(), "dd/mm/yyyy"),
    order_time: currentHour(),
    order_served_time: "",
    topping: addToping(),
    branch_open: openingTime[randomOpeningBranches],
    branch_close: closingTime[randomClosedBranches],
    topic: "order",
  };
}

const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  console.log(
    "************************************************************************************************" +
      "******************************** SIMULATOR STARTING ********************************************" +
      "**********************************************************************************************************************"
  );
  console.log("");
  let timeout;
  const runInterval = () => {
    console.log(
      "******************************* ORDER PRODUCED ************************************************"
    );
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      clearTimeout(timeout);
    },
  };
};

function orderDelivered(orderPool) {
  let randomDeliveredSeed = Math.floor(Math.random() * orderPool.length);
  orderId = orderPool[randomDeliveredSeed];
  orderPool.splice(randomDeliveredSeed, 1);
  return {
    order_id: orderId,
    served_time: currentHour(),
    topic: "delivered",
  };
}
let i = 0;
maxDeliveredTime = 3;
let index = 0;
let orderPool = [];
let timeToDeliver = Math.floor(Math.random() * maxDeliveredTime) + 5;
function intervalFunction() {
  let order = generateOrder();
  orderPool.push(order.order_id);
  if (i > timeToDeliver) {
    let deliveredAmount = Math.floor(Math.random() * orderPool.length);
    index = 0;
    while (orderPool.length != 0 && index < deliveredAmount) {
      console.log(
        "******************************* ORDER DELIVERED ************************************************"
      );
      let delivered = orderDelivered(orderPool);
      console.log(delivered);
      producer.delivered(delivered);
      index++;
    }
    timeToDeliver = Math.floor(Math.random() * maxDeliveredTime) + 5;
    index = 0;
    i = 0;
  }
  orderCount++;
  console.log("Inserted order: ", order);
  producer.publish(order);
  i++;
}
const interval = setRandomInterval(
  () => intervalFunction(),
  minOrderInterval,
  maxOrderInterval
);
