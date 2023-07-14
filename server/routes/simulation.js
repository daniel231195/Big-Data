import express from "express";
import { startSimulator, stopSimulator } from "../simulation/simulation.js";

const router = express.Router();

/**
 * Routes
 */
router.post("/startSimulation", startSimulator);
router.post("/stopSimulation", stopSimulator);

export default router;
