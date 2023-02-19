// const mongoose = require('mongoose');
// require("dotenv").config();

// mongoose.connect(process.env.DB_CONNECT);

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// const pizzaOrdersSchema = new Schema(
//     {
//             order_id: Number,
//             branch_id: String,
//             branch_name: String,
//             district: String,
//             order_status: String,
//             order_date: Date,
//             order_time: String,
//             order_served_time: Date,
//             topping: Array,
//             branch_open: Date,
//             branch_close: Date,
//             topic: String,
//     },
//     {
//             WriteConcern: {
//                     w: "majority",
//                     j: true,
//                     timeout: 1000,
//             },
//     }
// );

// const pizzaOrderModel = mongoose.model('pizzaOrders', pizzaOrdersSchema );
// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//         console.log("Connected to MongoDB");
// });

// module.exports = pizzaOrderModel;
