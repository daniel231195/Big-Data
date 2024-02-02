import {
  intervalFunction,
  orderDelivered,
  startGeneratingOrders,
  stopEvent,
  stopGeneratingOrders,
} from "../controllers/simulation.js";

import dotenv from "dotenv";
dotenv.config();

let isSimulatorRunning = false; // Flag to track whether the simulator is running
let intervalID = -1; // Variable to store the interval ID

const maxOrderInterval = 5000;
const minOrderInterval = 1000;
export const minTreatmentTime = 1;
export const maxTreatmentTime = 3;

export const startSimulator = async (req, res) => {
  try {
    if (isSimulatorRunning) {
      return res
        .status(200)
        .json({ Simulator: "Simulator is already running" });
    }

    startGeneratingOrders();
    intervalID = setInterval(() => {
      const delay =
        Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) +
        minOrderInterval;
      setTimeout(() => {
        intervalFunction(async (orderId, deliveryDelay) => {
          await orderDelivered(orderId, deliveryDelay);
        });
      }, delay);
    }, maxOrderInterval);

    isSimulatorRunning = true; // Set the flag to indicate that the simulator is running

    return res.status(200).json({ Simulator: "Simulator has been started" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ Simulator: "Error while trying to start the simulation" });
  }
};

export const stopSimulator = async (req, res) => {
  try {
    if (!isSimulatorRunning) {
      return res.status(200).json({ Simulator: "Simulator is not running" });
    }

    stopGeneratingOrders();
    stopEvent();

    // Clear the interval and set the flag to indicate that the simulator is stopped
    clearInterval(intervalID);
    isSimulatorRunning = false;

    return res.status(200).json({ Simulator: "Simulator has been stopped" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ Simulator: "Error while trying to stop the simulation" });
  }
};
