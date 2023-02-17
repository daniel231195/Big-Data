let mongoose = require("mongoose");

let orderModel = new mongoose.Schema(
  {
    order_id: { type: Number, required: true },
    branch_id: { type: Number, required: true },
    branch_name: { type: String, required: true },
    district: { type: String, required: true },
    order_status: { type: String, required: true },
    order_date: { type: String, required: true },
    order_time: { type: String, required: true },
    order_served_time: { type: String, required: false },
    toppings: { type: [String], required: false },
    branch_open: { type: String, required: true },
    branch_close: { type: String, required: true },
    topic: { type: String, required: true },
  },

  {
    WriteConcern: {
      w: "majority",
      j: true,
      timeout: 1000,
    },
  }
);

module.exports = mongoose.model("Order", orderModel);
