import express from "express";
import { getOrders, getSearch, getBranches } from "../controllers/client.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/search", getSearch);
router.get("/branches", getBranches);

export default router;
