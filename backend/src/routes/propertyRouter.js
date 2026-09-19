import express from "express";
import { protect } from "../controllers/authController.js";
import {
    getProperties,
    getProperty,
    createProperty,
    getUsersProperties,
    getproperty,
    getPropertyById
} from "../controllers/propertyController.js";

const propertyRouter = express.Router();

// Get all properties
propertyRouter.get("/", getproperty || getProperties);

// User accommodations
propertyRouter.get("/user/myAccomodation", protect, getUsersProperties);
propertyRouter.post("/createProperty", protect, createProperty);

// Get one property by ID
propertyRouter.get("/:id", getPropertyById || getProperty);

export { propertyRouter };