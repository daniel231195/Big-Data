import express from "express";
import {
  deleteSpecificKey,
  getKeyValue,
  deleteAllKeys,
} from "../controllers/dashboard.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hey");
});
router.get("/deleteKey/:key", deleteSpecificKey);
router.get("/deleteAll", deleteAllKeys);
router.get("/keys/:key", getKeyValue);

export default router;
