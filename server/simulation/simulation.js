import {
  intervalFunction,
  orderDelivered,
  startGeneratingOrders,
  stopEvent,
  stopGeneratingOrders,
} from "./simulationUtils.js";

import dotenv from "dotenv";
dotenv.config();

let intervalID = -1;
const maxOrderInterval = 5000;
const minOrderInterval = 1000;

export const minTreatmentTime = 1;
export const maxTreatmentTime = 2;

export const startSimulator = (req, res) => {
  try {
    startGeneratingOrders();
    clearInterval(intervalID);
    intervalID = setInterval(() => {
      const delay =
        Math.floor(Math.random() * (maxOrderInterval - minOrderInterval + 1)) +
        minOrderInterval;
      setTimeout(() => {
        intervalFunction((orderId) => {
          orderDelivered(orderId);
        });
      }, delay);
    }, maxOrderInterval);
    return res.status(200).json({ Simulator: "Simulator has been started" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ SimulatorError: `${error.message}` });
  }
};

export const stopSimulator = (req, res) => {
  try {
    stopGeneratingOrders();
    stopEvent();
    res.status(200).json({ Simulator: "Simulator has been stopped" });

    // Stop the simulator after 50 minutes
    setTimeout(() => {
      clearInterval(intervalID);
    }, (maxTreatmentTime + 1) * 60 * 1000);
  } catch (error) {
    return res.status(404).json({ SimulatorStopError: `${error.message}` });
  }
};
