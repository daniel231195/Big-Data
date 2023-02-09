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
 * /



 /**
 * All Routes
 * /


/**
 * Start Server on port 3001
 * @type {string|number}
 */
const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => console.log('server run on port %d', port));