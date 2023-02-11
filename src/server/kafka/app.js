const express = require("express");
const uuid = require("uuid");
const app = express();
var server = require("http").createServer(app);
var path = require("path");

// const io = require("socket.io")(server)
const port = 3000;

//------------ kafka------------
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>")
);



// app.get('/send', (req, res) => {
//     res.render('sender', {title: 'Sender Page'});
//     kafka.publish({key: "Gilad"});
//   });
// //------------ Socket.io ----------------
// io.on("connection", (socket) => {
//     console.log("new user connected");
//     socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
//     socket.on("callDetails", (msg) => { console.log(msg);kafka.publish(msg) });
// });

//------------------- kafka -----------
/* Kafka Producer Configuration */

//
//const client1 = new kafka.KafkaClient({kafkaHost: "localhost:9092"});

//------------------------------------

server.listen(port, () =>
  console.log(`Ariel app listening at http://localhost:${port}`)
);

