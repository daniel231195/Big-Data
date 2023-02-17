const kafka = require("../model/kafka");
const simulator = require("../model/simulator");
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

const startSimulator = (req, res) => {
  clearInterval(intervalID);
  intervalID = setInterval(() => {
    simulator.intervalFunction();
    const delay =
      Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) +
      minOrderInterval;
    clearInterval(intervalID);
    intervalID = setInterval(simulator.intervalFunction, delay);
  }, Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) + minOrderInterval);
  console.log("************ Auto mode started ************");
  res.send("************ Auto mode started ************");
};

const stopSimulator = (req, res) => {
  clearInterval(intervalID);
  console.log(console.log("************ Auto mode stopped ************"));
  res.send("************ Auto mode stopped ************");
};

module.exports = {
  sendMessage,
  startSimulator,
  stopSimulator,
};
