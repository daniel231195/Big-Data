const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/../../../.env` });

const controller = require("./controller/simulator.controller");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app
  .post("/api/startSimulator", controller.startSimulator)
  .post("/api/stopSimulator", controller.stopSimulator);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Stream Layer started at http://localhost:${port}`);
});
