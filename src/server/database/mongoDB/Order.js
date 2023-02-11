let mongoose = require("mongoose");

let pizzaSchema = new mongoose.Schema(
  {
    order_id: Number,
    branch_id: String,
    branch_name: String,
    district: String,
    order_status: String,
    order_date: Date,
    order_time: String,
    order_served_time: Date,
    topping: Array,
    branch_open: Date,
    branch_close: Date,
    topic: String,
  },
  {
    WriteConcern: {
      w: "majority",
      j: true,
      timeout: 1000,
    },
  }
);

module.exports = mongoose.model("Order", pizzaSchema);
