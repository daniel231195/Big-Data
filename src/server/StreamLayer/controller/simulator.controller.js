const kafka = require("../model/kafka");
const simulator = require("../model/simulator");
const fs = require("fs");
require("dotenv").config();

let intervalID = -1;
const maxOrderInterval = 5000;
const minOrderInterval = 2000;

const sendMessage = (req, res) => {
  try {
    kafka.publish(req.body);
    console.log("Message sent to kafka:", req.body);
    res.status(200).json({ message: "Message sent to kafka", order: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
let i;
try {
  i = Number(
    fs.readFileSync(
      "./src/server/StreamLayer/controller/orderCounter.txt",
      "utf8"
    )
  );
} catch (e) {
  console.error("Error reading orderCounter.txt", e);
}
console.log(i);
const startSimulator = (req, res) => {
  simulator.startGeneratingOrders();
  clearInterval(intervalID);
  intervalID = setInterval(() => {
    simulator.intervalFunction2(i, (orderId) => {
      simulator.orderDelivered2(orderId);
    });
    i++;
    const delay =
      Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) +
      minOrderInterval;
    clearInterval(intervalID);
    intervalID = setInterval(() => {
      simulator.intervalFunction2(i, (orderId) => {
        simulator.orderDelivered2(orderId);
      });
      i++;
    }, delay);
  }, Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) + minOrderInterval);
  console.log("************ Auto mode started ************");
  res.send("************ Auto mode started ************");
};

const stopSimulator = (req, res) => {
  simulator.stopGeneratingOrders();
  fs.writeFile("./src/server/StreamLayer/controller/orderCounter.txt", i.toString(), (err) => {
    if (err) {
      console.error(err);
    }
    lastOrder = i - 1;
    console.log(`Last order ${lastOrder} saved on orderCounter`);

    console.log(
      "************ Sig stop has been send stop taking orders ************\n"
    );

    res.send(
      `************ Sig stop has been send stop taking orders \nthe simulator will stop after 50 minuets when all delivery has been delivered ************\n`
    );
  });
  // Stop the simulator after 50 minutes
  setTimeout(() => {
    clearInterval(intervalID);
    console.log("************ Simulator stopped ************\n");
    process.exit(0);
  }, 50 * 60 * 1000);
};
module.exports = {
  sendMessage,
  startSimulator,
  stopSimulator,
};
