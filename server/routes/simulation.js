import express from "express";
import { startSimulator, stopSimulator } from "../simulation/simulation.js";

const router = express.Router();

router.post("/start", startSimulator);
router.post("/stop", stopSimulator);

export default router;
