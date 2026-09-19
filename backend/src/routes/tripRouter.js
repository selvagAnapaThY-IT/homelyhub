import express from "express";
import { createTripPlan } from "../controllers/tripController.js";

const tripRouter = express.Router();
tripRouter.post("/", createTripPlan);
tripRouter.post("/createTripPlan", createTripPlan);

export { tripRouter };