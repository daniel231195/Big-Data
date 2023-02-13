const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const mongoController = require("./controller/mongo.controller");
const bigmlController = require("./controller/bigml.controller");
const PizzaOrderModel = require("./model/PizzaOrder");
require('dotenv/config')
const app = express();



/* Middlewares */
app.use(express.json());
app.use(cors());

/* Routes */
app
    .get("/", (req, res) => res.send("Hello World!"))
    .get("/api/getAllOrder", mongoController.getAllOrder)
    .post("/api/insertOrder", mongoController.insertOrder)
    .delete("/api/deleteAllOrders", mongoController.deleteAllOrders)
    .get("/api/jsonFile", bigmlController.makeJsonFile)
    .get("/api/buildModel", bigmlController.buildModel)
    .get("/api/modelInfo", bigmlController.getModelInfo)
    .get("/api/datasetInfo", bigmlController.getDataSetlInfo)
    .post("/api/associationOrder", bigmlController.createAssociation);



/* Start server */
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Batch Layer listening at http://localhost:${PORT}`);
});