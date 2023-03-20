const kafka = require("../model/kafka");
const simulator = require("../model/simulator");
require("dotenv").config();

let intervalID = -1;
const maxOrderInterval = 5000;
const minOrderInterval = 1000;
let i = 1;


console.log(i);
const startSimulator = (req, res) => {
  simulator.startGeneratingOrders();
  clearInterval(intervalID);
  intervalID = setInterval(() => {
    simulator.intervalFunction(i, (orderId) => {
      simulator.orderDelivered(orderId);
    });
    i++;
    const delay =
      Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) +
      minOrderInterval;
    clearInterval(intervalID);
    intervalID = setInterval(() => {
      simulator.intervalFunction(i, (orderId) => {
        simulator.orderDelivered(orderId);
      });
      i++;
    }, delay);
  }, Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) + minOrderInterval);
  console.log("************ Auto mode started ************");
  res.send("************ Auto mode started ************");
};

const stopSimulator = (req, res) => {
  i = 0;
  simulator.stopGeneratingOrders();
  console.log(
    "************ Sig stop has been send stop taking orders ************\n"
  );

  res.send(
    `************ Sig stop has been send stop taking orders \nthe simulator will stop after 50 minuets when all delivery has been delivered ************\n`
  );
};
// Stop the simulator after 50 minutes
setTimeout(() => {
  clearInterval(intervalID);
  console.log("************ Simulator stopped ************\n");
  process.exit(0);
}, 50 * 60 * 1000);

module.exports = {
  startSimulator,
  stopSimulator,
};
