import {
  producer,
  publish,
  delivered,
  event,
  simulation,
} from "../kafka/producer.js";
import { pizzaToppings, pizzaBranches } from "../simulation/dataGenerator.js";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuid } from "uuid";
import {
  maxTreatmentTime,
  minTreatmentTime,
} from "../simulation/simulation.js";
import { getOrderServeTime } from "./orders.js";

let generateOrders = true;
export const SIMULATION_STOPPED = "Simulation Stopped";
export const stopGeneratingOrders = () => {
  generateOrders = false;
};
export const startGeneratingOrders = () => {
  generateOrders = true;
};

const addToping = () => {
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
};

function generateRandomDate() {
  const to = new Date();
  const from = new Date();
  from.setHours(9, 30, 0);
  to.setHours(22, 30, 0);
  return currentHour(
    new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()))
  );
}

const currentHour = (now) => {
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var myTime = ("0000" + (hours * 100 + minutes)).slice(-4);
  return myTime.substring(0, 2) + ":" + myTime.substring(2, myTime.length);
};

const formatDate = (date, format) => {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yyyy: date.getFullYear(),
  };
  return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
};

const generateOrder = (orderCount) => {
  let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
  return {
    orderId: orderCount,
    branchId: pizzaBranches[randomIndexBranches].branchId,
    branchName: pizzaBranches[randomIndexBranches].branchName,
    district: pizzaBranches[randomIndexBranches].district,
    orderStatus: "pending",
    orderDate: formatDate(new Date(), "dd/mm/yyyy"),
    orderTime: generateRandomDate(),
    orderServedTime: "",
    toppings: addToping(),
    branchOpen: pizzaBranches[randomIndexBranches].openTime,
    branchClose: pizzaBranches[randomIndexBranches].closeTime,
    topic: "order",
  };
};
export const orderDelivered = async (orderId, deliveryDelay) => {
  const orderTime = await getOrderServeTime(orderId);
  const deliver = {
    orderId: orderId,
    servedTime: currentHour(),
    topic: "delivered",
  };
  delivered(deliver);
};

const generateRandomTime = (min, max) => {
  const minTime = min * 60 * 1000; // min minutes in milliseconds
  const maxTime = max * 60 * 1000; // max minutes in milliseconds
  return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
};
const isBranchOpen = (branchId) => {
  const jsonBranch = pizzaBranches.find((t) => t.branchId === branchId);
  return jsonBranch.branchOpen === "Open";
};
const findMyBranch = (branchId) => {
  const index = pizzaBranches.findIndex((t) => t.branchId === branchId);
  return index;
};
const updateBranch = (branchEvent, index) => {
  pizzaBranches[index].branchOpen = branchEvent.branchEvent;
};

export const intervalFunction = (callback) => {
  let order = null;
  let deliveryDelay = maxTreatmentTime;
  const i = uuid();
  if (generateOrders === true) {
    order = generateOrder(i);
    if (isBranchOpen(order.branchId)) {
      console.log(`Order ${order.orderId} is being prepared`);
      publish(order);
      deliveryDelay = generateRandomTime(minTreatmentTime, maxTreatmentTime); // random delay between 3 to 15 minutes in milliseconds
    }
  }
  setTimeout(() => {
    if (order !== null) {
      console.log(`Order ${order.orderId} has been delivered`);
      callback(order.orderId, deliveryDelay);
    }
  }, deliveryDelay);
  const branchEvent = generateBranchEvent();
  let index = findMyBranch(branchEvent.branchId);
  if (pizzaBranches[index].branchOpen !== branchEvent.branchEvent) {
    updateBranch(branchEvent, index);
    event(branchEvent);
  }
};

export const generateBranchEvent = () => {
  let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
  let randomEvent = Math.random(0, 1) > 0.2 ? "Open" : "Close";
  return {
    branchId: pizzaBranches[randomIndexBranches].branchId,
    branchName: pizzaBranches[randomIndexBranches].branchName,
    branchEvent: randomEvent,
    topic: "event",
  };
};
export const stopEvent = () => {
  simulation(getStopEvent());
};
const getStopEvent = () => {
  return {
    topic: SIMULATION_STOPPED,
  };
};
