/**
 * All require
 */
const http = require('http');
const express = require('express');
const app = express();
const cors = require("cors");
const batchController = require("./controller/batch.controller");
const streamController = require("./controller/stream.controller");


/**
 * Connection
 */


/**
 * All Middlewares
 */
 app.use(express.json());
 app.use(cors());


 /**
 * All Routes
 */
 app
     .get("/", (req, res) => res.send("Hello World!"))
     .get("/batch/getModelInfo", batchController.getModelInfo)
     .get("/batch/getDataSetInfo", batchController.getDataSet)
 ;
 //     .get("/stream", )

/**
 * Start Server on port 3001
 * @type {string|number}
 */
const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => console.log('server run on port %d', port));