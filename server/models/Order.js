import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    branchId: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
    },
    orderServedTime: {
      type: String,
    },
    toppings: [String],
    branchOpen: String,
    branchClose: String,
    topic: String,
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
