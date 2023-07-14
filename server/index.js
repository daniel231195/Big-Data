import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import { Server } from "socket.io";
import { createServer } from "http";

import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import simulationRoutes from "./routes/simulation.js";
import dashboardRoutes from "./routes/dashboard.js";

// data imports
import User from "./models/User.js";
import { dataUser } from "./data/index.js";
import Order from "./models/Order.js";
import { mongoListener } from "./controllers/orders.js";
import { elasticListener } from "./controllers/search.js";
import { redisListener } from "./controllers/dashboard.js";
import { getOrdersDataArray } from "./models/OrderProcess.js";
import { time } from "console";

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

/* ROUTES */
// app.use("/", (req, res) => {
//   return res
//     .status(201)
//     .json({ Hello: "Welcome to the best pizza production server" });
// });

app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/simulation", simulationRoutes);
app.use("/dashboard", dashboardRoutes);

const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });
let timeChange = null;
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
  // console.log(response);
  socket.emit("FromAPI", response);
};

const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    httpServer.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    mongoListener();
    elasticListener();
    redisListener();

    /* ONLY ADD DATA ONE TIME */
    // User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));
// httpServer.listen(app.get("port"), () => {
//   var port = httpServer.address().port;
//   console.log("Running on : ", port);
// });
