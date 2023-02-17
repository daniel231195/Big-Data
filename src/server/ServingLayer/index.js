/**
 * All require
 */
const http = require('http');
const express = require('express');
const app = express();
const controller = require('./controller/controller')


/**
 * Connection
 */


/**
 * All Middlewares
 */
 app.use(express.json());
 // app.use(cors());


 /**
 * All Routes
 */
 // app
 //     .get("/", (req, res) => res.send("Hello World!"))
 //     .get("/dashboard/", mongoController.getAllOrder)

/**
 * Start Server on port 3001
 * @type {string|number}
 */
const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => console.log('server run on port %d', port));