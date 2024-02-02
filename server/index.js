import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import { Server } from "socket.io";
import { createServer } from "http";

import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import dashboardRoutes from "./routes/dashboard.js";
import simulationRoutes from "./routes/simulation.js";

// data imports
import User from "./models/User.js";
import { dataUser } from "./data/index.js";
import Order from "./models/Order.js";
import { mongoListener } from "./controllers/orders.js";
import {
  deleteElasticCollections,
  elasticListener,
} from "./controllers/search.js";
import { deleteAllKeys, redisListener } from "./controllers/dashboard.js";
import { getOrdersDataArray } from "./models/OrderProcess.js";
import redisClient, { initRedis } from "./config/redisConnection.js";
/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/simulation", simulationRoutes);

const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", async (socket) => {
  console.log("connection established");
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});
const getApiAndEmit = async (socket) => {
  const response = await getOrdersDataArray();
  socket.emit("FromAPI", response);
};
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function resetDbs() {
  await redisClient.connect();
  await Order.collection.drop();
  await deleteAllKeys();
  await deleteElasticCollections();
  console.log("All dbs are empty");
}

const PORT = process.env.PORT || 9000;
try {
  await resetDbs();
  initRedis();
  httpServer.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  mongoListener();
  elasticListener();
  redisListener();

  /* ONLY ADD DATA ONE TIME */
  // User.insertMany(dataUser);
} catch (error) {
  console.log(`${error} did not connect`);
}
// httpServer.listen(app.get("port"), () => {
//   var port = httpServer.address().port;
//   console.log("Running on : ", port);
// });
